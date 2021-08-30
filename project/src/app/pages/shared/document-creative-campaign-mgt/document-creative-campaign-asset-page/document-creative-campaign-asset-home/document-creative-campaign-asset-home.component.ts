import { Component, ComponentFactoryResolver, Input, ComponentRef, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { NbMenuItem } from '@core/nebular/theme';
import { AdvanceSearchService, DocumentModel, NuxeoAutomations, NuxeoPagination, SearchResponse, UserModel } from '@core/api';
import { DocumentListViewItem } from '../../../document-list-view/document-list-view.interface';
import { GlobalSearchFormSettings } from '../../../global-search-form/global-search-form.interface';
import { ListSearchRowCustomViewSettings } from '../../../list-search-form/list-search-form.interface';
import { ListSearchRowCustomViewComponent } from '../../../list-search-form-in-dialog/list-search-row-custom-view-component';
import { DocumentCreativeCampaignMgtBaseComponent } from '../../document-creative-campaign-mgt-base.component';
import { CampaignMgtNavigationSettings } from '../../shared/document-creative-campaign-navigation/document-creative-campaign-navigation.interface';
import { CreativeCampaignMgtSettings } from '../../document-creative-campaign-mgt.interface';
import { DocumentPageService, GlobalEvent } from '../../../services/document-page.service';
import { of as observableOf, Observable } from 'rxjs';
import { NUXEO_DOC_TYPE } from '@environment/environment';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { vocabularyFormatter } from '@core/services/helpers';
import { SearchFilterModel } from '../../../../shared/global-search-filter/global-search-filter.interface';
import { DocumentCreativeCampaignAssetHomeMenuComponent } from './document-creative-campaign-asset-home-action/document-creative-compaign-asset-home-menu.component';
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
export class DocumentCreativeCampaignAssetRowRenderComponent {
  @Input() value: { mediatypes: any; countries: string };
}

@Component({
  selector: 'document-creative-campaign-asset-home',
  styleUrls: ['../../document-creative-campaign-mgt.component.scss', '../document-creative-campaign-asset-page.component.scss'],
  templateUrl: './document-creative-campaign-asset-home.component.html',
})
export class DocumentCreativeCampaignAssetHomeComponent extends DocumentCreativeCampaignMgtBaseComponent {
  @ViewChild('dynamicTarget', { static: true, read: ViewContainerRef }) dynamicTarget: ViewContainerRef;

  dynamicComponent: ComponentRef<any>;

  LEFT_COMP = {
    home_menu: DocumentCreativeCampaignAssetHomeMenuComponent,
  };

  private actions: NbMenuItem[] = [
    {
      id: 'edit-campaign',
      title: 'Edit Campaign',
      type: 'page',
      triggerChangeSettings: {
        name: 'edit-campaign',
        type: 'view',
        formMode: 'edit',
        document: this.document,
      },
    },
    {
      id: 'create-new-project',
      title: 'Create New Project',
      type: 'page',
      triggerChangeSettings: {
        name: 'create-new-project',
        type: 'view',
        formMode: 'create',
        document: this.document,
      },
    },
  ];

  filters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_assettype_agg', placeholder: 'Asset Type' }),
    new SearchFilterModel({ key: 'the_loupe_rights_contract_mediatypes_agg', placeholder: 'Media Usage' }),
  ];

  defaultParams: any = {
    ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
    currentPageIndex: 0,
    ecm_fulltext: '',
  };

  navSettings: CampaignMgtNavigationSettings;

  searchFormSettingsAsset: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    schemas: ['dublincore', 'The_Loupe_Main', 'The_Loupe_Credits', 'The_Loupe_ProdCredits', 'The_Loupe_Rights'],
    source: 'document-creative-campaign-asset',
    enableSearchForm: false,
    autoSearch: false,
  });

  listViewSettingsAsset: any = {
    hideHeader: false,
    hideSubHeader: true,
    columns: {
      action: {
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'thumbnail',
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
        renderComponent: DocumentCreativeCampaignAssetRowRenderComponent,
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
  };

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
    private advanceSearchService: AdvanceSearchService,
  ) {
    super(documentPageService, componentFactoryResolver);
    this.subscribeHomeEvents();
  }

  protected onInit(): void {
    this.createComponent(this.LEFT_COMP.home_menu);
  }

  afterSearch: (res: SearchResponse) => Observable<SearchResponse> = (res: SearchResponse) => {
    return this.getUsageRightsStatus(res);
  };

  onMenuClick(item: NbMenuItem): void {
    this.triggerChangeView(item.id, item.type);
  }

  vocabularyFormatter(list: string[]): string {
    return vocabularyFormatter(list);
  }

  protected createComponent(component: Type<any>): void {
    this.dynamicComponent = this.createDynamicMenuComponent(component);
    this.dynamicComponent.instance.actions$.next(this.actions);
    this.dynamicComponent.instance.document = this.document;
    const subscription = this.dynamicComponent.instance.itemClick.subscribe((item: NbMenuItem) => {
      const itemInfo = item.triggerChangeSettings;
      this.triggerChangeView(itemInfo['name'], itemInfo['type'], this.createMgtSettings(itemInfo['formMode']));
    });
    this.subscription.add(subscription);
  }

  private createDynamicMenuComponent(component: Type<any>): ComponentRef<any> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    this.dynamicTarget.clear();
    return this.dynamicTarget.createComponent(componentFactory);
  }

  private createMgtSettings(mode: string = 'eidt'): any{
    return {
      mainViewChanged: true,
      document: mode === 'edit'? this.document : this.document.getParent(),
      project: this.templateSettings.project,
      homeTemplate: 'creative-campaign-mgt-template',
      homePage: 'asset-page',
      homeView: 'asset-home-view',
      formMode: mode,
      showMessageBeforeSave: false,
      // batchDocuments: this.selectedItems,
      campaign: this.document,
    };
  }

  protected beforeSetDocument(doc: DocumentModel, user: UserModel, formSettings: CreativeCampaignMgtSettings): Observable<DocumentModel> {
    this.navSettings = this.buildNavSettings(doc);
    return observableOf(doc);
  }

  private buildNavSettings(doc: DocumentModel): any {
    return new CampaignMgtNavigationSettings({
      currentPage: 'asset-page',
      searchFormParams: this.buildAssetParams(doc, doc.getParent('brand')),
      searchFormFilters: this.filters,
      searchFormSettings: new GlobalSearchFormSettings({
        schemas: ['dublincore', 'The_Loupe_Main', 'The_Loupe_Credits', 'The_Loupe_ProdCredits', 'The_Loupe_Rights'],
        source: 'document-creative-campaign-asset',
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
      pageSize: 100,
    };
    if (doc) {
      params['ecm_uuid_not_eq'] = doc.uid;
      params['the_loupe_main_campaign'] = `["${doc.get('The_Loupe_Main:campaign')}"]`;
    }
    if (brand) {
      params['ecm_path'] = brand.path;
    }
    return params;
  }

  private subscribeHomeEvents(): void {
    const subscription = this.documentPageService.onEventType('list-search-row-custom-view').subscribe((event: GlobalEvent) => {
      this.triggerChangeView('asset-detail-view', 'view', new CreativeCampaignMgtSettings({
        mainViewChanged: true,
        document: event.data.document,
        project: this.document,
        homeTemplate: 'creative-project-mgt-template',
        homePage: 'asset-page',
        homeView: 'asset-detail-view',
      }));
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
            doc.properties['_usage_rights_'] = status || {};
          });
          return res;
        }),
      );
    }
    return observableOf(res);
  }
}
