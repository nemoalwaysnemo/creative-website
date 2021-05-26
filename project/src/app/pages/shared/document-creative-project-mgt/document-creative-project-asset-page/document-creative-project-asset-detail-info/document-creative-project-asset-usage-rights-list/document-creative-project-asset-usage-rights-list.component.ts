import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvanceSearchService, DocumentModel, NuxeoAutomations, NuxeoPagination, SearchResponse } from '@core/api';
import { DocumentPageService } from '../../../../services/document-page.service';
import { Observable, Subject, timer, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { GlobalSearchFormSettings } from '../../../../../shared/global-search-form/global-search-form.interface';
import { ListSearchRowCustomViewSettings } from '../../../../../shared/list-search-form/list-search-form.interface';
import { ListSearchRowCustomViewComponent } from '../../../../../shared/list-search-form-in-dialog/list-search-row-custom-view-component';
import { NUXEO_DOC_TYPE } from '@environment/environment';
import { DocumentListViewItem } from '../../../../../shared/document-list-view/document-list-view.interface';

enum AssetTypes {
  music = 'App-Library-UsageRights-Music',
  stock = 'App-Library-UsageRights-Stock',
  photo = 'App-Library-UsageRights-Photographer',
  talent = 'App-Library-UsageRights-Talent',
}

@Component({
  template: `
    <ng-container *ngIf="value" [ngSwitch]="true">
      <h4>{{value.title}}</h4>
      <ng-container *ngFor="let item of value.types">
        <div class="usage-rights-list">
          <div class="media-usage-type left">
            <span>{{item.media_usage_type}}</span>
          </div>
          <div class="contract-countries left">
            <span>{{item.contract_countries}}</span>
          </div>
          <div class="start-airing-date left">
            <span>{{item.start_airing_date | date :'MMM d, yyyy':'UTC'}}</span>
          </div>
          <div class="contract-duration left">
            <span>{{item.contract_duration}}</span>
          </div>
          <div class="usage-item left">
            <span>{{item.item}}</span>
          </div>
        </div>
      </ng-container>
    </ng-container>
  `,
})
export class DocumentCreativeAssetUsageRightsRowRenderComponent {
  @Input() value: { types: any , title: string };
}

@Component({
  selector: 'document-creative-project-asset-usage-rights-list',
  styleUrls: ['./document-creative-project-asset-usage-rights-list.component.scss'],
  templateUrl: './document-creative-project-asset-usage-rights-list.component.html',
})
export class DocumentCreativeProjectAssetUsageRightsListComponent {

  usageRights: any = {};

  doc: DocumentModel;

  loading: boolean = true;

  contractUid: any = [];

  baseParams$: Subject<any> = new Subject<any>();

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'document-creative-project-usage-rights-list',
    enableSearchInput: false,
  });

  listViewSettings: any = {
    hideHeader: false,
    hideSubHeader: true,
    columns: {
      type: {
        title: 'Type',
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'icon',
        }),
        renderComponent: ListSearchRowCustomViewComponent,
      },
      title: {
        title: 'Contract ID / Media Types / Coverage / Start Airing / Duration / Items',
        sort: false,
        type: 'custom',
        renderComponent: DocumentCreativeAssetUsageRightsRowRenderComponent,
      },
      usageRights: {
        title: 'Expiry Date / Days of use',
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'usage-rights-expiry',
        }),
        renderComponent: ListSearchRowCustomViewComponent,
      },
    },
  };

  constructor(protected documentPageService: DocumentPageService,
              private advanceSearchService: AdvanceSearchService,
              ) { }

  @Input()
  set document(doc: DocumentModel) {
    this.doc = doc;
    this.loading = false;
    this.buildContract(doc);
    if (this.contractUid.length > 0) {
      timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetParams(doc, doc.getParent('brand'))); });
    }
  }

  listViewBuilder: (docs: DocumentModel[]) => any = (docs: DocumentModel[]) => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        type: { url: this.getTypeImage(doc) },
        title: { types: doc.get('The_Loupe_Rights:contract_items_usage_types'), title: doc.title },
        usageRights: doc.get('_usage_rights_'),
      }));
    }
    return items;
  }

  afterSearch: (res: SearchResponse) => Observable<SearchResponse> = (res: SearchResponse) => {
    return this.getUsageRightsStatus(res);
  }

  protected buildContract(doc: DocumentModel): void {
    if (doc) {
      this.contractUid = this.buildContractUid(doc);
    }
  }

  protected buildAssetParams(doc: DocumentModel, brand: DocumentModel): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_UR_CONTRACT_TYPES,
      currentPageIndex: 0,
      ecm_fulltext: '',
    };
    if (brand) {
      params['ecm_path'] = brand.path;
    }
    if (doc) {
      params['ecm_uuid'] = `["${this.contractUid.join('", "')}"]`;
    }
    return params;
  }

  protected buildContractUid(doc: DocumentModel): string[] {
    const contract: string[] = [];
    const model: string = doc.get('The_Loupe_Talent:Contract-Model-IDs').join(',');
    if (model.length > 0) { contract.push(model); }
    const music: string = doc.get('The_Loupe_Talent:Contract-Music-IDs').join(',');
    if (music.length > 0) { contract.push(music); }
    const photo: string = doc.get('The_Loupe_Talent:Contract-Photographer-IDs').join(',');
    if (photo.length > 0) { contract.push(photo); }
    const stock: string = doc.get('The_Loupe_Talent:Contract-Stock-IDs').join(',');
    if (stock.length > 0) { contract.push(stock); }
    return contract;
  }

  protected getUsageRightsStatus(res: SearchResponse): Observable<SearchResponse> {
    const uids: string[] = res.response.entries.map((doc: DocumentModel) => doc.uid);
    if (uids.length > 0) {
      return this.advanceSearchService.operation(NuxeoAutomations.GetDocumentURStatus, { uuids: `${uids.join(',')}`, entityType: 'contract' }).pipe(
        map((response: NuxeoPagination) => {
          res.response.entries.forEach((doc: DocumentModel) => {
            const status = response.entries.find((x: any) => x.uuid === doc.uid);
            doc.properties['_usage_rights_'] = status || {};
          });
          return res;
        }),
      );
    }
    return observableOf(res);
  }

  protected getTypeImage(doc): string {
    let imgUrl;
    switch (doc.type) {
      case AssetTypes.stock:
        imgUrl = '/assets/images/ur_contract_stock.png';
        break;
      case AssetTypes.talent:
        imgUrl = '/assets/images/ur_contract_talent.png';
        break;
      case AssetTypes.music:
        imgUrl = '/assets/images/ur_contract_music.png';
        break;
      case AssetTypes.photo:
        imgUrl = '/assets/images/ur_contract_photo.png';
        break;
      default:
        break;
    }
    return imgUrl;
  }
}
