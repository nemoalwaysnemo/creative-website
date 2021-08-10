import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AdvanceSearchService, DocumentModel, NuxeoAutomations, NuxeoPagination, SearchResponse } from '@core/api';
import { DocumentPageService, GlobalEvent } from '../../../services/document-page.service';
import { Observable, of as observableOf, Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { GlobalSearchFormSettings } from '../../../global-search-form/global-search-form.interface';
import { ListSearchRowCustomViewSettings } from '../../../list-search-form/list-search-form.interface';
import { ListSearchRowCustomViewComponent } from '../../../list-search-form-in-dialog/list-search-row-custom-view-component';
import { NUXEO_DOC_TYPE } from '@environment/environment';
import { DocumentListViewItem } from '../../../document-list-view/document-list-view.interface';
import { ASSET_TYPES } from '../document-creative-project-usage-rigths-type-config';

@Component({
  styleUrls: ['../document-creative-project-usage-rights-page.component.scss'],
  template: `
  <ng-container *ngIf="value" [ngSwitch]="true">
  <h4>{{value.title}}</h4>
      <ng-container *ngFor="let item of value.types">
        <div class="usage-rights-list">
          <div class="usage-rights-item left">
            <span>{{item.media_usage_type}}</span>
          </div>
          <div class="usage-rights-item left">
            <span>{{item.contract_countries}}</span>
          </div>
          <div class="usage-rights-item left">
            <span>{{item.start_airing_date | date :'MMM d, yyyy':'UTC'}}</span>
          </div>
          <div class="usage-rights-item left">
            <span>{{item.contract_duration}}</span>
          </div>
          <div class="usage-rights-item left">
            <span>{{item.item}}</span>
          </div>
        </div>
      </ng-container>
    </ng-container>
  `,
})
export class DocumentCreativeUsageRightsRowRenderComponent {
  @Input() value: { types: any; title: string };
}


@Component({
  styleUrls: ['../../document-creative-project-mgt.component.scss', '../document-creative-project-usage-rights-page.component.scss'],
  template: '<button class="button" (click)="onClick()">Link Asset</button>',
})

export class DocumentCreativeUsageRightsLinkButtonComponent implements OnInit, OnDestroy{

  constructor(
    protected documentPageService: DocumentPageService,
  ) {}

  subscription: Subscription = new Subscription();

  @Input() value: { uid: any; type: any };

  onClick(): void {
    this.documentPageService.triggerEvent(new GlobalEvent({ name: 'LinkAssetClick', data: this.value}));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.afterLink();
  }

  afterLink(): void {
    const subscription = this.documentPageService.onEvent('AfterLinkAssetClick').pipe(
      map(data => data.value),
      filter(uid => uid === this.value.uid),
    ).subscribe(_ => {
      // something wrong?!
    });
    this.subscription.add(subscription);
  }
}

@Component({
  selector: 'document-creative-project-usage-rights-list',
  styleUrls: ['../../document-creative-project-mgt.component.scss', '../document-creative-project-usage-rights-page.component.scss'],
  template: '<list-search-form-in-dialog [searchParams]="defaultParams" [settings]="searchFormSettings" [listViewSettings]="listViewSettings" [listViewBuilder]="listViewBuilder" [afterSearch]="afterSearch"></list-search-form-in-dialog>',
})
export class DocumentCreativeProjectUsageRightsListComponent {

  @Output() value$: Subject<any> = new Subject<any>();

  usageRights: any = {};

  doc: DocumentModel;

  loading: boolean = true;

  contractUid: any = [];

  defaultParams: any = {
    ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
    currentPageIndex: 0,
    ecm_fulltext: '',
  };

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    schemas: ['dublincore', 'The_Loupe_Talent', 'The_Loupe_Main', 'The_Loupe_Credits', 'The_Loupe_ProdCredits', 'The_Loupe_Rights'],
    source: 'document-creative-project-usage-right',
    enableSearchForm: false,
    autoSearch: false,
  });

  listViewSettings: any = {
    hideHeader: false,
    hideSubHeader: true,
    showCheckbox: true,
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
        renderComponent: DocumentCreativeUsageRightsRowRenderComponent,
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
      link: {
        title: 'link',
        sort: false,
        type: 'custom',
        renderComponent: DocumentCreativeUsageRightsLinkButtonComponent,
      },
    },
  };

  constructor(
    protected documentPageService: DocumentPageService,
    private advanceSearchService: AdvanceSearchService,
  ) {}

  @Input()
  set document(doc: DocumentModel) {
    this.doc = doc;
    this.loading = false;
  }

  listViewBuilder: (docs: DocumentModel[]) => any = (docs: DocumentModel[]) => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        type: { url: this.getTypeImage(doc) },
        title: { types: doc.get('The_Loupe_Rights:contract_items_usage_types'), title: doc.title },
        usageRights: doc.get('_usage_rights_'),
        link: { uid: doc.uid, type: doc.type},
      }));
    }
    return items;
  };

  afterSearch: (res: SearchResponse) => Observable<SearchResponse> = (res: SearchResponse) => {
    return this.getUsageRightsStatus(res);
  };

  protected buildContractUid(doc: DocumentModel): void {
    const model: string = doc.get('The_Loupe_Talent:Contract-Model-IDs');
    if (model.length > 0) { this.buildData(model); }
    const music: string = doc.get('The_Loupe_Talent:Contract-Music-IDs');
    if (music.length > 0) { this.buildData(music); }
    const photo: string = doc.get('The_Loupe_Talent:Contract-Photographer-IDs');
    if (photo.length > 0) { this.buildData(photo); }
    const stock: string = doc.get('The_Loupe_Talent:Contract-Stock-IDs');
    if (stock.length > 0) { this.buildData(stock); }
  }

  protected buildData(data: any): void {
    if (typeof (data) === 'string') {
      this.contractUid.push(data);
    } else {
      this.contractUid = this.contractUid.concat(data);
    }
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
      case ASSET_TYPES.stock:
        imgUrl = '/assets/images/ur_contract_stock.png';
        break;
      case ASSET_TYPES.talent:
        imgUrl = '/assets/images/ur_contract_talent.png';
        break;
      case ASSET_TYPES.music:
        imgUrl = '/assets/images/ur_contract_music.png';
        break;
      case ASSET_TYPES.photo:
        imgUrl = '/assets/images/ur_contract_photo.png';
        break;
      default:
        break;
    }
    return imgUrl;
  }
}
