import { Component, ComponentFactoryResolver, Input } from '@angular/core';
import { NbMenuItem } from '@core/nebular/theme';
import { AdvanceSearchService, DocumentModel, NuxeoAutomations, NuxeoPagination, SearchResponse, UserModel } from '@core/api';
import { DocumentListViewItem } from '../../../document-list-view/document-list-view.interface';
import { GlobalSearchFormSettings } from '../../../global-search-form/global-search-form.interface';
import { ListSearchRowCustomViewSettings } from '../../../list-search-form/list-search-form.interface';
import { ListSearchRowCustomViewComponent } from '../../../list-search-form-in-dialog/list-search-row-custom-view-component';
import { DocumentCreativeProjectMgtBaseComponent } from '../../document-creative-project-mgt-base.component';
import { ProjectMgtNavigationSettings } from '../../shared/document-creative-project-navigation/document-creative-project-navigation.interface';
import { CreativeProjectMgtSettings } from '../../document-creative-project-mgt.interface';
import { DocumentPageService, GlobalEvent } from '../../../services/document-page.service';
import { Subject, of as observableOf, Observable } from 'rxjs';
import { NUXEO_DOC_TYPE } from '@environment/environment';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { vocabularyFormatter } from '@core/services/helpers';
import { SearchFilterModel } from '../../../global-search-filter/global-search-filter.interface';
import { TrurthifyPipe } from 'ngx-pipes';
@Component({
  template: `
    <ng-container *ngIf="value" [ngSwitch]="true">
      <ng-container *ngFor="let type of value.mediatypes">
        <div class="asset-mediatype">
          <span>{{type}}</span>
        </div>
      </ng-container>
        <div class="asset-country">
          <span>{{value.countries}}</span>
        </div>
    </ng-container>
  `,
})
export class DocumentCreativeProjectAssetRowRenderComponent {
  @Input() value: { mediatypes: any, countries: string };
}

@Component({
  selector: 'document-creative-project-modify-assets',
  styleUrls: ['../../document-creative-project-mgt.component.scss', '../document-creative-project-asset-page.component.scss'],
  templateUrl: './document-creative-project-modify-assets.component.html',
})
export class DocumentCreativeProjectModifyAssetsComponent extends DocumentCreativeProjectMgtBaseComponent {

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
    private advanceSearchService: AdvanceSearchService,
  ) {
    super(documentPageService, componentFactoryResolver);
    this.subscribeHomeEvents();
  }

  actions: NbMenuItem[] = [
    {
      id: 'import',
      title: 'Import',
      type: 'page',
    },
    {
      id: '3rd-import',
      title: 'Create 3rd Party Import',
      type: 'page',
    },
    {
      id: 'delivery',
      title: 'Create Delivery Package',
      type: 'page',
    },
    {
      id: 'modify-assets',
      title: ' Modify Assets',
      // hidden: this.disabledCheck('modif-assets'),
    },
    {
      id: 'set-usage-rights',
      title: ' Set Usage Rights',
      type: 'page',
    },
  ];

  disableButtons: boolean = true;

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_assettype_agg', placeholder: 'Asset Type' }),
    new SearchFilterModel({ key: 'the_loupe_rights_contract_mediatypes_agg', placeholder: 'Media Usage' }),
  ];

  defaultParams: any = {
    ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
    currentPageIndex: 0,
    ecm_fulltext: '',
  };

  navSettings: ProjectMgtNavigationSettings;

  searchFormSettingsAsset: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    schemas: ['dublincore', 'The_Loupe_Main', 'The_Loupe_Credits', 'The_Loupe_ProdCredits', 'The_Loupe_Rights'],
    source: 'document-creative-project-asset',
    enableSearchForm: false,
    autoSearch: false,
  });

  listViewSettingsAsset: any = {
    hideHeader: false,
    selectMode: 'multi',
    hideSubHeader: true,
    showCheckbox: true,
    columns: {
      action: {
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'thumbnail',
          enableClick: true,
        }),
        renderComponent: ListSearchRowCustomViewComponent,
      },
      title: {
        title: 'Title',
        sort: false,
      },
      type: {
        title: 'Asset Type',
        sort: false,
      },
      date: {
        title: 'Airing Date',
        sort: false,
        valuePrepareFunction: (value: any) => {
          return value ? new DatePipe('en-US').transform(value, 'yyyy-MM-dd') : null;
        },
      },
      coverage: {
        title: 'Coverage',
        sort: false,
        type: 'custom',
        renderComponent: DocumentCreativeProjectAssetRowRenderComponent,
      },
      usageRights: {
        title: 'Status',
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'usage-rights-expiry',
        }),
        renderComponent: ListSearchRowCustomViewComponent,
      },
    },
  };

  selectedItems: any[] = [];

  listViewBuilderAsset: (docs: DocumentModel[]) => any = (docs: DocumentModel[]) => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        action: doc,
        title: doc.title,
        type: doc.get('The_Loupe_Main:assettype'),
        date: doc.get('The_Loupe_Rights:first-airing'),
        coverage: { mediatypes: doc.get('The_Loupe_Rights:contract_mediatypes'), countries: vocabularyFormatter(doc.get('The_Loupe_Rights:asset_countries')) },
        usageRights: doc.get('_usage_rights_'),
      }));
    }
    return items;
  }

  afterSearch: (res: SearchResponse) => Observable<SearchResponse> = (res: SearchResponse) => {
    return this.getUsageRightsStatus(res);
  }

  onMenuClick(item: NbMenuItem): void {
    this.triggerChangeView(item.id, item.type);
  }

  vocabularyFormatter(list: string[]): string {
    return vocabularyFormatter(list);
  }

  protected beforeSetDocument(doc: DocumentModel, user: UserModel, formSettings: CreativeProjectMgtSettings): Observable<DocumentModel> {
    this.navSettings = this.buildNavSettings(doc);
    return observableOf(doc);
  }

  private buildNavSettings(doc: DocumentModel): any {
    return new ProjectMgtNavigationSettings({
      currentPage: 'asset-page',
      searchFormParams: this.buildAssetParams(doc, doc.getParent('brand')),
      searchFormFilters: this.filters,
      searchFormSettings: new GlobalSearchFormSettings({
        schemas: ['dublincore', 'The_Loupe_Main', 'The_Loupe_Credits', 'The_Loupe_ProdCredits', 'The_Loupe_Rights'],
        source: 'document-creative-project-asset',
        searchGroupPosition: 'right',
        enableSearchForm: true,
        enableSearchInput: false,
      }),
    });
  }

  private buildAssetParams(doc: DocumentModel, brand: DocumentModel): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
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

  private subscribeHomeEvents(): void {
    const subscription = this.documentPageService.onEventType('list-search-row-custom-view').subscribe((event: GlobalEvent) => {
      this.triggerChangeView('asset-detail-view', 'view', new CreativeProjectMgtSettings({ project: this.document, document: event.data.document }));
    });
    this.subscription.add(subscription);
  }

  private getUsageRightsStatus(res: SearchResponse): Observable<SearchResponse> {
    const uids: string[] = res.response.entries.map((doc: DocumentModel) => doc.uid);
    if (uids.length > 0) {
      return this.advanceSearchService.operation(NuxeoAutomations.GetDocumentURStatus, { uuids: `${uids.join(',')}`, entityType: 'asset' }).pipe(
        map((response: NuxeoPagination) => {
          res.response.entries.forEach((doc: DocumentModel) => {
            const status = response.entries.find((x: any) => x.uuid === doc.uid);
            doc.setProperty('_usage_rights_', status || {}, true);
          });
          return res;
        }),
      );
    }
    return observableOf(res);
  }

  onSelected(row: any): void {
    this.selectedItems = row.selected;
    if (this.selectedItems.length > 0){
      this.disableButtons = false;
    }
  }

}
