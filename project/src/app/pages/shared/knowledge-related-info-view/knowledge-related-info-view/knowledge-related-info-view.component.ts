import { Component, Input, TemplateRef, ViewChild, OnInit, OnDestroy, ViewContainerRef, Type, ComponentRef, ComponentFactoryResolver } from '@angular/core';
import { DocumentModel, NuxeoPagination, NuxeoQuickFilters, SearchResponse } from '@core/api';
import { DOCUMENT_PREVIEW_IN_DIALOG } from '../../document-preview-in-dialog/document-preview-in-dialog-mapping';
import { GlobalSearchFormSettings } from '../../global-search-form/global-search-form.interface';
import { GlobalSearchFormService } from '../../global-search-form/global-search-form.service';
import { DocumentPageService, GlobalEvent } from '../../services/document-page.service';
import { SearchFilterModel } from '../../global-search-filter/global-search-filter.interface';
import { GlobalDocumentDialogService } from '../../global-document-dialog';
import { TabInfo } from '../knowledge-related-info.component';
import { Subject, Subscription, timer } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Environment } from '@environment/environment';

@Component({
  selector: 'knowledge-related-info-view',
  styleUrls: ['./knowledge-related-info-view.component.scss'],
  templateUrl: './knowledge-related-info-view.component.html',
})
export class KnowledgeRelatedInfoViewComponent implements OnInit, OnDestroy {

  @ViewChild('dynamicTarget', { static: true, read: ViewContainerRef }) dynamicTarget: ViewContainerRef;

  @ViewChild('backslashThumbnailItemView', { static: true }) private backslashItemView: TemplateRef<any>;

  @ViewChild('disruptionThumbnailItemView', { static: true }) private disruptionItemView: TemplateRef<any>;

  @ViewChild('intelligenceThumbnailItemView', { static: true }) private intelligenceItemView: TemplateRef<any>;

  @ViewChild('creativeThumbnailItemView', { static: true }) private creativeItemView: TemplateRef<any>;

  @Input() item: any = {};

  @Input()
  set tabInfo(info: TabInfo) {
    if (info) {
      this.document = info.document;
      this.tabInfo$.next(info);
    }
  }

  agencyItem: any = {};

  brandItem: any = {};

  currentView: string = 'relatedInfo';

  thumbnailItemView: TemplateRef<any>;

  edgeLoading: boolean = true;

  append: boolean = false;

  document: DocumentModel;

  documents: DocumentModel[] = [];

  backslashEdges: DocumentModel[] = [];

  baseParams$: Subject<any> = new Subject<any>();

  baseParamsBrand$: Subject<any> = new Subject<any>();

  baseParamsAgency$: Subject<any> = new Subject<any>();

  searchFormSettings: GlobalSearchFormSettings;

  searchFormAgencySettings: GlobalSearchFormSettings;

  searchFormBrandSettings: GlobalSearchFormSettings;

  filters: SearchFilterModel[] = [];

  forbiddenParams: string[] = [
    'app_global_networkshare',
  ];

  private backslashFilters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'app_edges_tags_edges_agg', placeholder: 'Edges' }),
    new SearchFilterModel({ key: 'app_edges_backslash_category_agg', placeholder: 'Category' }),
    new SearchFilterModel({ key: 'app_edges_backslash_type_agg', placeholder: 'Type' }),
    new SearchFilterModel({ key: 'the_loupe_main_brand_agg', placeholder: 'Brand' }),
    new SearchFilterModel({ key: 'app_edges_relevant_country_agg', placeholder: 'Geography', iteration: true }),
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'the_loupe_main_country_agg', placeholder: 'Agency Country', iteration: true }),
  ];

  private disruptionFilters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_brand_agg', placeholder: 'Brand' }),
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'the_loupe_main_country_agg', placeholder: 'Country', iteration: true }),
    new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
    new SearchFilterModel({ key: 'app_edges_tags_edges_agg', placeholder: 'Edges' }),
  ];

  private intelligenceFilters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'ecm_tag_agg', placeholder: 'Tag' }),
    new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
    new SearchFilterModel({ key: 'app_edges_relevant_country_agg', placeholder: 'Geography', iteration: true }),
    new SearchFilterModel({ key: 'the_loupe_main_brand_agg', placeholder: 'Brand' }),
    new SearchFilterModel({ key: 'app_edges_intelligence_type_agg', placeholder: 'Intelligence Type' }),
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'app_edges_backslash_category_agg', placeholder: 'Backslash Category' }),
    new SearchFilterModel({ key: 'app_edges_tags_edges_agg', placeholder: 'Edges' }),
  ];

  private tabInfo$ = new Subject<TabInfo>();

  private dynamicComponentRef: ComponentRef<any>;

  private subscription: Subscription = new Subscription();

  constructor(
    private documentPageService: DocumentPageService,
    private globalSearchFormService: GlobalSearchFormService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private globalDocumentDialogService: GlobalDocumentDialogService,
  ) { }

  ngOnInit(): void {
    this.onChangeTab();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getBackslashEdgeUrl(name: string): string {
    return Environment.backslashAppUrl + `/#/list/edge/${name}/`;
  }

  onLoadMore(res: SearchResponse): void {
    this.append = true;
    let params = [];
    switch (res.source) {
      case 'document-related-agency':
        params = this.getRelatedAgencySearchParams(this.document, this.agencyItem);
        params['currentPageIndex'] = res.response.currentPageIndex + 1;
        params['pageSize'] = 4;
        this.baseParamsAgency$.next(res.searchParams.setParams(params));
        break;
      case 'document-related-brand':
        params = this.getRelatedBrandSearchParams(this.document, this.brandItem);
        params['currentPageIndex'] = res.response.currentPageIndex + 1;
        params['pageSize'] = 4;
        this.baseParamsBrand$.next(res.searchParams.setParams(params));
        break;
      default:
        params = this.getSearchParams(this.document, this.item);
        params['currentPageIndex'] = res.response.currentPageIndex + 1;
        params['pageSize'] = 8;
        this.baseParams$.next(res.searchParams.setParams(params));
        break;
    }
  }

  onResponse(res: SearchResponse): void {
    if (['document-load-more-in-dialog', 'document-related-agency', 'document-related-brand'].includes(res.source)) {
      this.append = false;
    }
  }

  searchBrandResultFilter(res: SearchResponse): boolean {
    return res.source === 'document-related-brand';
  }

  searchAgencyResultFilter(res: SearchResponse): boolean {
    return res.source === 'document-related-agency';
  }

  getDialogPrviewTemplateName(type: string): Type<any> {
    switch (type) {
      case 'Backslash':
        return DOCUMENT_PREVIEW_IN_DIALOG.PREVIEW_RELATED_BACKSLASH_ASSET;
      case 'Disruption':
        return DOCUMENT_PREVIEW_IN_DIALOG.PREVIEW_RELATED_DISRUPTION_ASSET;
      case 'Intelligence':
        return DOCUMENT_PREVIEW_IN_DIALOG.PREVIEW_RELATED_DISRUPTION_ASSET;
      case 'Creative':
        return DOCUMENT_PREVIEW_IN_DIALOG.PREVIEW_RELATED_CREATIVE_ASSET;
      default:
        break;
    }
  }

  preview(type: string, documentModel: DocumentModel): void {
    this.currentView = 'previewInfo';
    this.createDynamicTarget(this.getDialogPrviewTemplateName(type), { documentModel, title: documentModel.title });
  }

  close(delay: number = 0): void {
    timer(delay).subscribe(_ => {
      this.globalDocumentDialogService.close();
    });
  }

  private onChangeTab(): void {
    const subscription = this.tabInfo$.pipe(
      filter((info: TabInfo) => info.document && info.tabItem.name === this.item.name),
    ).subscribe((info: TabInfo) => {
      this.append = false;
      if (info.type === 'docChanged') {
        this.documents = [];
      }
      if (info.tabItem.children) {
        info.tabItem.children.map((item: any) => {
          this.getThumbnailItemName(item.layout, info);
          if (this.documents.length === 0) {
            this.itemTriggerSearch(info.document, item);
          }
        });
      } else {
        this.getThumbnailItemName(info.tabItem.layout, info);
        if (this.documents.length === 0) {
          this.triggerSearch(info.document, this.item);
        }
      }
    });
    this.subscription.add(subscription);
  }

  private getThumbnailItemName(item: string, info: TabInfo): void {
    switch (item) {
      case 'backslash':
        this.buildBackslashEdges(info.document);
        this.thumbnailItemView = this.backslashItemView;
        this.filters = this.backslashFilters;
        break;
      case 'disruption':
        this.thumbnailItemView = this.disruptionItemView;
        this.filters = this.disruptionFilters;
        break;
      case 'intelligence':
        this.thumbnailItemView = this.intelligenceItemView;
        this.filters = this.intelligenceFilters;
        break;
      case 'brand':
      case 'agency':
        this.thumbnailItemView = this.creativeItemView;
        break;
      default:
        break;
    }
  }

  private triggerSearch(doc: DocumentModel, item: any): void {
    this.searchFormSettings = new GlobalSearchFormSettings({
      source: 'document-load-more-in-dialog',
      searchGroupPosition: 'right',
      pageProvider: item.provider,
      forbiddenSearchParams: this.forbiddenParams,
    });
    this.baseParams$.next(this.getSearchParams(doc, item));
  }

  private triggerBrandSearch(doc: DocumentModel, item: any): void {
    this.searchFormBrandSettings = new GlobalSearchFormSettings({
      source: 'document-related-brand',
      searchGroupPosition: 'right',
      pageProvider: item.provider,
      enableSearchInput: item.enableSearchInput,
      forbiddenSearchParams: this.forbiddenParams,
    });
    this.baseParamsBrand$.next(this.getRelatedBrandSearchParams(doc, item));
  }

  private triggerAgencySearch(doc: DocumentModel, item: any): void {
    this.searchFormAgencySettings = new GlobalSearchFormSettings({
      source: 'document-related-agency',
      searchGroupPosition: 'right',
      pageProvider: item.provider,
      enableSearchInput: item.enableSearchInput,
      forbiddenSearchParams: this.forbiddenParams,
    });
    this.baseParamsAgency$.next(this.getRelatedAgencySearchParams(doc, item));
  }

  private itemTriggerSearch(doc: DocumentModel, item: any): void {
    switch (item.layout) {
      case 'brand':
        this.triggerBrandSearch(doc, item);
        this.brandItem = item;
        break;
      case 'agency':
        this.triggerAgencySearch(doc, item);
        this.agencyItem = item;
        break;
      default:
        break;
    }
  }

  private getSearchParams(doc: DocumentModel, item: any): any {
    const params = Object.assign({ ecm_uuid_not_eq: doc.uid }, item.params);
    if (item.hasOwnProperty('paramsMapping')) {
      const keys = Object.keys(item.paramsMapping);
      for (const key of keys) {
        const value = doc.get(item.paramsMapping[key]);
        params[key] = typeof value === 'string' || !value ? `"${value}"` : `"${value.join('", "')}"`;
      }
    }
    return params;
  }

  private getRelatedBrandSearchParams(doc: DocumentModel, item: any): any {
    const brands = doc.get('The_Loupe_Main:brand');
    return Object.assign({ ecm_uuid_not_eq: doc.uid, the_loupe_main_brand_any: brands.length !== 0 ? `["${doc.get('The_Loupe_Main:brand').join('", "')}"]` : '' }, item.params);
  }

  private getRelatedAgencySearchParams(doc: DocumentModel, item: any): any {
    return Object.assign({ ecm_uuid_not_eq: doc.uid, the_loupe_main_brand_not_in: `["${doc.get('The_Loupe_Main:brand')}"]`, the_loupe_main_agency: doc.get('The_Loupe_Main:agency') }, item.params);
  }

  private getEdgesAggParams(doc: DocumentModel): string {
    const edges = doc.get('app_Edges:Tags_edges');
    return edges.length !== 0 ? `["${edges.join('", "')}"]` : '';
  }

  private buildBackslashEdges(doc: DocumentModel): void {
    const edgesParams = this.getEdgesAggParams(doc);
    if (edgesParams) {
      const params: any = {
        // app_edges_active_article: true,
        app_edges_tags_edges: edgesParams,
        quickFilters: NuxeoQuickFilters.BackslashEdgePage,
        ecm_path: this.documentPageService.getConfig('path:BACKSLASH_BASE_FOLDER_PATH'),
      };
      this.edgeLoading = true;
      const subscription = this.globalSearchFormService.advanceRequest(params).subscribe((res: NuxeoPagination) => {
        this.edgeLoading = false;
        this.backslashEdges = res.entries;
      });
      this.subscription.add(subscription);
    } else {
      this.edgeLoading = false;
      this.backslashEdges = [];
    }
  }

  private createDynamicTarget(component: Type<any>, metadata: any = {}): void {
    this.destroyDynamicComponent();
    const dynamicComponentRef = this.createDynamicComponent(this.dynamicTarget, component);
    for (const key in metadata) {
      if (metadata[key]) {
        dynamicComponentRef.instance[key] = metadata[key];
      }
    }
    this.dynamicComponentRef = dynamicComponentRef;
    this.dynamicComponentRef.instance.callback.subscribe((e: any) => {
      if (e.action === 'close') {
        if (e.data.all) {
          this.close();
        }
        this.currentView = 'relatedInfo';
        this.destroyDynamicComponent();
        this.documentPageService.triggerEvent(new GlobalEvent({ name: 'Closed', type: 'knowledge-inner-dialog' }));
      }
    });
    this.documentPageService.triggerEvent(new GlobalEvent({ name: 'Opened', type: 'knowledge-inner-dialog' }));
  }

  private createDynamicComponent(dynamicTarget: ViewContainerRef, component: Type<any>): ComponentRef<any> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    return dynamicTarget.createComponent(componentFactory);
  }

  private destroyDynamicComponent(): void {
    if (this.dynamicComponentRef) {
      this.dynamicComponentRef.destroy();
      this.dynamicComponentRef = null;
    }
  }
}
