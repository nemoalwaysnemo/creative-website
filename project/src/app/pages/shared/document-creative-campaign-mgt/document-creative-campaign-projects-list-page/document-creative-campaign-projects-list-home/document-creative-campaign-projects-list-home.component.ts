import { Component, ComponentFactoryResolver, Input, ComponentRef, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { NbMenuItem } from '@core/nebular/theme';
import { AdvanceSearchService, DocumentModel, NuxeoAutomations, NuxeoPagination, SearchResponse, UserModel, NuxeoSearchConstants, GlobalSearchParams, NuxeoRequestOptions } from '@core/api';
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
import { map, tap } from 'rxjs/operators';
import { vocabularyFormatter } from '@core/services/helpers';
import { SearchFilterModel } from '../../../../shared/global-search-filter/global-search-filter.interface';
import { GlobalDocumentDialogService } from '../../../global-document-dialog/global-document-dialog.service';
import { TAB_CONFIG } from './document-creative-campaign-project-list-home-tab-config';

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
export class DocumentCreativeCampaignProjectsListRowRenderComponent {
  @Input() value: { mediatypes: any; countries: string };
}

@Component({
  selector: 'document-creative-campaign-projects-list-home',
  styleUrls: ['../../document-creative-campaign-mgt.component.scss', '../document-creative-campaign-projects-list-page.component.scss'],
  templateUrl: './document-creative-campaign-projects-list-home.component.html',
})
export class DocumentCreativeCampaignProjectsListHomeComponent extends DocumentCreativeCampaignMgtBaseComponent {

  @ViewChild('dynamicTarget', { static: true, read: ViewContainerRef }) dynamicTarget: ViewContainerRef;

  tabs: NbMenuItem[] = TAB_CONFIG;

  dynamicComponent: ComponentRef<any>;

  actions: NbMenuItem[] = [
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
        title: 'Project Title',
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'text',
          placeholder: '2111111',
          enableDialog: true,
        }),
        renderComponent: ListSearchRowCustomViewComponent,
      },
      title: {
        title: 'Project Title',
        sort: false,
      },
      job_number: {
        title: 'Job Number',
        sort: false,
      },
      date: {
        title: 'Live Date',
        sort: false,
        valuePrepareFunction: (value: any) => {
          return value ? new DatePipe('en-US').transform(value, 'yyyy-MM-dd') : null;
        },
      },
      assets_count: {
        title: '#asseet',
        sort: false,
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
        job_number: doc.get('The_Loupe_Main:jobnumber'),
        date: doc.get('The_Loupe_ProdCredits:production_date'),
        assets_count: doc.get('_assets_count_') ? doc.get('_assets_count_') : 'N/A',
      }));
    }
    return items;
  };

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    private advanceSearchService: AdvanceSearchService,
  ) {
    super(documentPageService, componentFactoryResolver, globalDocumentDialogService);
    this.subscribeHomeEvents();
  }

  protected onInit(): void {
    this.actions$.next(this.actions);
  }

  afterSearch: (res: SearchResponse) => Observable<SearchResponse> = (res: SearchResponse) => {
    return this.getAssetsCount(res);
  };

  onSelected(event) {
  }

  vocabularyFormatter(list: string[]): string {
    return vocabularyFormatter(list);
  }

  protected beforeSetDocument(doc: DocumentModel, user: UserModel, formSettings: CreativeCampaignMgtSettings): Observable<DocumentModel> {
    this.navSettings = this.buildNavSettings(doc);
    return observableOf(doc);
  }

  private buildNavSettings(doc: DocumentModel): any {
    return new CampaignMgtNavigationSettings({
      currentPage: 'campaign-projects-page',
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
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_PROJECT_TYPE,
      ecm_mixinType: NuxeoSearchConstants.HiddenInNavigation,
      currentPageIndex: 0,
      ecm_fulltext: '',
      pageSize: 100,
    };
    if (doc) {
      params['the_loupe_main_campaign'] = `["${doc.get('The_Loupe_Main:campaign')}"]`;
    }
    if (brand) {
      params['ecm_path'] = brand.path;
    }
    return params;
  }

  private subscribeHomeEvents(): void {
    const subscription = this.documentPageService.onEventType('list-search-row-custom-view').subscribe((event: GlobalEvent) => {
      if (event.name === 'ItemClicked') {
        this.triggerChangeView('asset-home-view', 'page', new CreativeCampaignMgtSettings({
          mainViewChanged: true,
          title: event.data.document.title,
          document: event.data.document,
          project: event.data.document,
          mainViewDocument: this.document,
          homeTemplate: 'creative-project-mgt-template',
          homePage: 'asset-page',
          homeView: 'asset-home-view',
          component: this.getPageComponent(this.tabs, 'project-asset-page'),
        }));
      }
    });
    this.subscription.add(subscription);
  }

  private getAssetsCount(res: SearchResponse): Observable<SearchResponse> {
    const projectCountsParam: any = {
      pageSize: 100,
      currentPageIndex: 0,
      ecm_fulltext: '',
      ecm_path: this.document.getParent('brand').path,
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
    };
    return this.documentPageService.advanceRequest(projectCountsParam, new NuxeoRequestOptions({ skipAggregates: false })).pipe(
      map((response: NuxeoPagination) => {
        const agg = response.aggregations.the_loupe_main_jobtitle_agg.extendedBuckets;
        res.response.entries.forEach(project => {
          if (agg.find(item => item.key === project.uid)) {
            project.properties['_assets_count_'] = agg.find(item => item.key === project.uid).docCount;
          }
        });
        return res;
      }),
    );
  }

  changeMenuView(event): void {
    const settings = event.triggerChangeSettings;
    this.triggerChangeView(settings.name, settings.type, new CreativeCampaignMgtSettings({
      mainViewChanged: true,
      document: settings.formMode === 'edit' ? this.document : this.document.getParent('brand'),
      project: this.templateSettings.project,
      homeTemplate: 'creative-campaign-mgt-template',
      homePage: 'campaign-projects-page',
      homeView: 'project-list-home',
      formMode: settings.formMode,
      showMessageBeforeSave: false,
      mainViewDocument: this.document,
      campaign: this.document,
      // component: this.getPageComponent(this.tabs, settings.name),
    }));
  }
}
