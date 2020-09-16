import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DocumentModel, SearchResponse, AdvanceSearchService, NuxeoAutomations, NuxeoPagination } from '@core/api';
import { Subject, timer, Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListSearchRowCustomViewComponent } from '../../list-search-form';
import { ListSearchRowCustomViewSettings } from '../../list-search-form/list-search-form.interface';
import { DocumentListViewItem } from '../../document-list-view/document-list-view.interface';
import { GlobalSearchFormSettings } from '../../global-search-form/global-search-form.interface';
import { NUXEO_DOC_TYPE } from '@environment/environment';
import { assetPath } from '@core/services/helpers';

enum AssetTypes {
  music = 'App-Library-UsageRights-Music',
  stock = 'App-Library-UsageRights-Stock',
  photo = 'App-Library-UsageRights-Photographer',
  talent = 'App-Library-UsageRights-Talent',
}

@Component({
  selector: 'document-creative-project-usage-rights',
  styleUrls: ['../document-creative-project-mgt.component.scss'],
  templateUrl: './document-creative-project-usage-rights.component.html',
})
export class DocumentCreativeProjectUsageRightsComponent {

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      this.loading = false;
      timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetParams(doc, doc.getParent('brand'))); });
    }
  }

  @Input()
  set listViewOptions(settings: any) {
    if (settings) {
      this.listViewSettings = Object.assign({}, this.defaultSettings, settings);
      timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetParams(this.doc, this.doc.getParent('brand'))); });
    } else {
      this.listViewSettings = this.defaultSettings;
    }
  }

  constructor(
    private advanceSearchService: AdvanceSearchService,
  ) { }

  loading: boolean = true;

  doc: DocumentModel;

  listViewSettings: any;

  baseParams$: Subject<any> = new Subject<any>();

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'document-creative-project-usage-rights',
    enableSearchInput: false,
  });

  defaultSettings: any = {
    hideSubHeader: true,
    selectMode: 'multi', // single|multi
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
        title: 'Title',
        sort: false,
      },
      usageRights: {
        title: 'Usage Rights Expiry',
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'usage-rights-expiry',
        }),
        renderComponent: ListSearchRowCustomViewComponent,
      },
    },
  };

  @Output() onResponsed: EventEmitter<SearchResponse> = new EventEmitter<SearchResponse>();
  @Output() onSelect: EventEmitter<SearchResponse> = new EventEmitter<SearchResponse>();

  listViewBuilder: Function = (docs: DocumentModel[]): any => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        type: { url: this.getTypeImage(doc) },
        title: doc.title,
        usageRights: doc.get('_usage_rights_'),
      }));
    }
    return items;
  }

  afterSearch: Function = (res: SearchResponse): Observable<SearchResponse> => {
    return this.getUsageRightsStatus(res);
  }

  onSelected(row: any): void {
    this.onSelect.emit(row);
  }

  onResponse(res: SearchResponse): void {
    this.onResponsed.emit(res);
  }

  protected buildAssetParams(doc: DocumentModel, brand: DocumentModel): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_UR_CONTRACT_TYPES,
      currentPageIndex: 0,
      ecm_fulltext: '',
    };
    if (doc) {
      params['ecm_uuid_not_eq'] = doc.uid;
      params['the_loupe_main_jobtitle_any'] = `["${doc.get('The_Loupe_Main:jobtitle')}"]`;
    }
    if (brand) {
      params['ecm_path'] = brand.path;
    }
    return params;
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
        imgUrl = 'assets/images/ur_contract_stock.png';
        break;
      case AssetTypes.talent:
        imgUrl = 'assets/images/ur_contract_talent.png';
        break;
      case AssetTypes.music:
        imgUrl = 'assets/images/ur_contract_music.png';
        break;
      case AssetTypes.photo:
        imgUrl = 'assets/images/ur_contract_photo.png';
        break;
      default:
        break;
    }
    return assetPath(imgUrl);
  }
}
