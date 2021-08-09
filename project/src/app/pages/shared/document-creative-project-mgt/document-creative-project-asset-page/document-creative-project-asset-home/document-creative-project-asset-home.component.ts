import { Component, ComponentFactoryResolver, ComponentRef, Input, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { NbMenuItem } from '@core/nebular/theme';
import { vocabularyFormatter } from '@core/services/helpers';
import { DocumentModel, NuxeoAutomations, NuxeoPagination, SearchResponse, UserModel } from '@core/api';
import { DocumentListViewItem } from '../../../document-list-view/document-list-view.interface';
import { GlobalSearchFormSettings } from '../../../global-search-form/global-search-form.interface';
import { ListSearchRowCustomViewSettings } from '../../../list-search-form/list-search-form.interface';
import { ProjectMgtNavigationSettings } from '../../shared/document-creative-project-navigation/document-creative-project-navigation.interface';
import { ListSearchRowCustomViewComponent } from '../../../list-search-form-in-dialog/list-search-row-custom-view-component';
import { DocumentCreativeProjectMgtBaseComponent } from '../../document-creative-project-mgt-base.component';
import { GlobalDocumentDialogService } from '../../../global-document-dialog/global-document-dialog.service';
import { SearchFilterModel } from '../../../../shared/global-search-filter/global-search-filter.interface';
import { DocumentPageService, GlobalEvent } from '../../../services/document-page.service';
import { CreativeProjectMgtSettings } from '../../document-creative-project-mgt.interface';
import { of as observableOf, Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { NUXEO_DOC_TYPE } from '@environment/environment';
import { DocumentCreativeProjectAssetHomeMenuComponent } from './document-creative-project-asset-home-action/document-creative-project-asset-home-menu.component';
import { DocumentCreativeProjectModifyAssetsComponent } from '../document-creative-project-modify-assets/document-creative-project-modify-assets.component';

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
  selector: 'document-creative-project-asset-home',
  styleUrls: ['../../document-creative-project-mgt.component.scss', '../document-creative-project-asset-page.component.scss'],
  templateUrl: './document-creative-project-asset-home.component.html',
})
export class DocumentCreativeProjectAssetHomeComponent extends DocumentCreativeProjectMgtBaseComponent {

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    super(documentPageService, componentFactoryResolver, globalDocumentDialogService);
    this.subscribeHomeEvents();
  }

  @ViewChild('dynamicTarget', { static: true, read: ViewContainerRef }) dynamicTarget: ViewContainerRef;

  dynamicComponent: ComponentRef<any>;

  LEFT_COMP = {
    home_menu: DocumentCreativeProjectAssetHomeMenuComponent,
    modify_assets: DocumentCreativeProjectModifyAssetsComponent,
  };

  private actions: NbMenuItem[] = [
    {
      id: 'import-asset-page',
      title: 'Import',
      type: 'page',
      triggerChangeSettings: {
        name: 'import-asset-page',
        type: 'view',
        formMode: 'create',
        document: this.document,
      },
    },
    {
      id: '3rd-import-new-request',
      title: 'Request 3rd Paryt Import',
      type: 'page',
      triggerChangeSettings: {
        name: '3rd-import-new-request',
        type: 'view',
        formMode: 'create',
        document: this.document,
      },
    },
    {
      id: 'delivery-package',
      title: 'Create Delivery Package',
      type: 'page',
      triggerChangeSettings: {
        name: 'delivery-package',
        type: 'view',
        formMode: 'create',
        document: this.document,
      },
    },
    {
      id: 'modify-assets',
      title: 'Modify Assets',
      type: 'page',
      triggerChangeSettings: {
        name: 'modify-assets',
        type: 'view',
        formMode: 'edit',
        document: this.document,
      },
    },
    {
      id: 'set-usage-rights',
      title: 'Set Usage Rights',
      type: 'page',
      triggerChangeSettings: {
        name: 'set-usage-rights',
        type: 'view',
        formMode: 'edit',
        document: this.document,
      },
    },
    {
      id: 'edit-project',
      title: 'Edit Project',
      type: 'page',
      triggerChangeSettings: {
        name: 'edit-project',
        type: 'view',
        formMode: 'edit',
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

  navSettings: ProjectMgtNavigationSettings;

  searchFormSettingsAsset: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    schemas: ['dublincore', 'file', 'files', 'video', 'picture', 'facetedTag', 'The_Loupe_Main', 'The_Loupe_Credits', 'The_Loupe_ProdCredits', 'The_Loupe_Rights', 'The_Loupe_Talent'],
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
  selectedItems: DocumentModel[] = [];

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

  vocabularyFormatter(list: string[]): string {
    return vocabularyFormatter(list);
  }

  onSelected(row: any): void {
    this.selectedItems = row.selected.map((item: DocumentListViewItem) => item.action);
    this.dynamicComponent.instance.actions$.next(this.buildActions(this.selectedItems.length > 0));
  }

  protected onInit(): void {
    this.createComponent(this.LEFT_COMP.home_menu);
  }

  protected beforeSetDocument(doc: DocumentModel, user: UserModel, formSettings: CreativeProjectMgtSettings): Observable<DocumentModel> {
    this.navSettings = this.buildNavSettings(doc);
    return observableOf(doc);
  }

   protected createComponent(component: Type<any>): void {
     this.dynamicComponent = this.createDynamicMenuComponent(component);
     this.dynamicComponent.instance.actions$.next(this.buildActions(false));
     this.dynamicComponent.instance.document = this.document;
     const subscription = this.dynamicComponent.instance.itemClick.subscribe((item: NbMenuItem) => {
       if (item.id !== 'modify-assets'){
         const itemInfo = item.triggerChangeSettings;
         this.triggerChangeView(itemInfo['name'], itemInfo['type'], this.createMgtSettings(itemInfo['formMode']));
       }else{
         this.setFormComponent();
       }
     });
     this.subscription.add(subscription);
  }

  private setFormComponent(): void {
    this.dynamicComponent = this.createDynamicMenuComponent(this.LEFT_COMP.modify_assets);
    this.dynamicComponent.instance.documentModel = this.document;
    this.dynamicComponent.instance.settings = this.createMgtSettings();
  }

  private createDynamicMenuComponent(component: Type<any>): ComponentRef<any> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    this.dynamicTarget.clear();
    return this.dynamicTarget.createComponent(componentFactory);
  }

  private createMgtSettings(mode: string = 'eidt'): CreativeProjectMgtSettings {
    return new CreativeProjectMgtSettings({
      mainViewChanged: true,
      document: this.document,
      project: this.templateSettings.project,
      homeTemplate: 'creative-project-mgt-template',
      homePage: 'asset-page',
      homeView: 'asset-home-view',
      formMode: mode,
      showMessageBeforeSave: false,
      batchDocuments: this.selectedItems,
      brand: this.document.getParent(),
    });
  }

  private buildNavSettings(doc: DocumentModel): any {
    return new ProjectMgtNavigationSettings({
      currentPage: 'asset-page',
      searchFormParams: this.buildAssetParams(doc, doc.getParent('brand')),
      searchFormFilters: this.filters,
      searchFormSettings: new GlobalSearchFormSettings({
        schemas: ['dublincore', 'file', 'files', 'video', 'picture', 'facetedTag', 'The_Loupe_Main', 'The_Loupe_Credits', 'The_Loupe_ProdCredits', 'The_Loupe_Rights', 'The_Loupe_Talent'],
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
      pageSize: 100,
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
      this.triggerChangeView('asset-detail-view', 'view', new CreativeProjectMgtSettings({
        mainViewChanged: true,
        project: this.document,
        document: event.data.document,
        homeTemplate: 'creative-project-mgt-template',
        homePage: 'asset-page',
        homeView: 'asset-home-view',
      }));
    });
    this.subscription.add(subscription);
  }

  private getUsageRightsStatus(res: SearchResponse): Observable<SearchResponse> {
    const uids: string[] = res.response.entries.map((doc: DocumentModel) => doc.uid);
    if (uids.length > 0) {
      return this.documentPageService.operation(NuxeoAutomations.GetDocumentURStatus, { uuids: `${uids.join(',')}`, entityType: 'asset' }).pipe(
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

  private buildActions(enable: boolean): any {
    return this.actions.map((a: any) => {
      if (['modify-assets', 'set-usage-rights'].includes(a.id)) {
        a.enable = enable;
      }
      return a;
    });
  }
}
