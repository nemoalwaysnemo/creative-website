import { Component, Input, TemplateRef, ViewChild, OnInit, OnDestroy, Type } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { DocumentModel, NuxeoPagination, NuxeoQuickFilters, SearchFilterModel, SearchResponse } from '@core/api';
import { GLOBAL_DOCUMENT_DIALOG, GlobalDocumentDialogService, GlobalDocumentDialogSettings } from '../../global-document-dialog';
import { GlobalSearchFormSettings } from '../../global-search-form/global-search-form.interface';
import { GlobalSearchFormService } from '../../global-search-form/global-search-form.service';
import { DocumentModelForm } from '../../global-document-form/global-document-form.component';
import { TabInfo } from '../document-related-info.component';
import { Environment, NUXEO_PATH_INFO } from '@environment/environment';

@Component({
  selector: 'document-related-info-view',
  styleUrls: ['./document-related-info-view.component.scss'],
  templateUrl: './document-related-info-view.component.html',
})
export class DocumentRelatedInfoViewComponent implements OnInit, OnDestroy {

  @ViewChild('backslashThumbnailItemView', { static: true }) private backslashItemView: TemplateRef<any>;

  @ViewChild('disruptionThumbnailItemView', { static: true }) private disruptionItemView: TemplateRef<any>;

  @ViewChild('intelligenceThumbnailItemView', { static: true }) private intelligenceItemView: TemplateRef<any>;

  @Input() item: any = {};

  @Input()
  set tabInfo(info: TabInfo) {
    if (info) {
      this.document = info.document;
      this.tabInfo$.next(info);
    }
  }

  private tabInfo$ = new Subject<TabInfo>();

  private subscription: Subscription = new Subscription();

  thumbnailItemView: TemplateRef<any>;

  edgeLoading: boolean = true;

  append: boolean = false;

  document: DocumentModel;

  documents: DocumentModel[] = [];

  backslashEdges: DocumentModel[] = [];

  noResultText: string;

  dialogMetadata: any = {
    enablePreview: true,
    enableEdit: false,
    enableDeletion: false,
    moreInfo: true,
    enableDetail: true,
  };

  backslashTitle: string = 'Backslash';

  disruptionTitle: string = 'Disruption';

  intelligenceTitle: string = 'Intelligence';

  baseParams$: Subject<any> = new Subject<any>();

  searchFormSettings: GlobalSearchFormSettings;

  backslashFilters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'app_edges_tags_edges_agg', placeholder: 'Edges' }),
    new SearchFilterModel({ key: 'app_edges_backslash_category_agg', placeholder: 'Category' }),
    new SearchFilterModel({ key: 'app_edges_backslash_type_agg', placeholder: 'Type' }),
    new SearchFilterModel({ key: 'the_loupe_main_brand_agg', placeholder: 'Brand' }),
    new SearchFilterModel({ key: 'app_edges_relevant_country_agg', placeholder: 'Geography', iteration: true }),
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'the_loupe_main_country_agg', placeholder: 'Agency Country', iteration: true }),
  ];

  disruptionFilters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'the_loupe_main_brand_agg', placeholder: 'Brand' }),
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'the_loupe_main_country_agg', placeholder: 'Country', iteration: true }),
    new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
    new SearchFilterModel({ key: 'app_edges_tags_edges_agg', placeholder: 'Edges' }),
  ];

  intelligenceFilters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'ecm_tag_agg', placeholder: 'Tag' }),
    new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
    new SearchFilterModel({ key: 'app_edges_relevant_country_agg', placeholder: 'Geography', iteration: true }),
    new SearchFilterModel({ key: 'the_loupe_main_brand_agg', placeholder: 'Brand' }),
    new SearchFilterModel({ key: 'app_edges_intelligence_type_agg', placeholder: 'Intelligence Type' }),
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'app_edges_backslash_category_agg', placeholder: 'Backslash Category' }),
    new SearchFilterModel({ key: 'app_edges_tags_edges_agg', placeholder: 'Edges' }),
  ];

  filters: SearchFilterModel[] = [];

  constructor(
    private globalSearchFormService: GlobalSearchFormService,
    private globalDocumentDialogService: GlobalDocumentDialogService,
  ) { }

  ngOnInit(): void {
    this.onChangeTab();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

  getBackslashEdgeUrl(name: string): string {
    return Environment.backslashAppUrl + `/#/list/edge/${name}/`;
  }

  getDialogSettings(type: string): GlobalDocumentDialogSettings {
    const components: Type<DocumentModelForm>[] = [];
    switch (type) {
      case 'backslash':
        components.push(GLOBAL_DOCUMENT_DIALOG.PREIVEW_RELATED_BACKSLASH_ASSET);
        break;
      case 'disruption':
        components.push(GLOBAL_DOCUMENT_DIALOG.PREIVEW_RELATED_DISRUPTION_ASSET);
        break;
      case 'intelligence':
        components.push(GLOBAL_DOCUMENT_DIALOG.PREIVEW_RELATED_DISRUPTION_ASSET);
        break;
      default:
        break;
    }
    return new GlobalDocumentDialogSettings({ components });
  }

  onLoadMore(res: SearchResponse): void {
    this.append = true;
    const params = this.getSearchParams(this.document, this.item);
    params['currentPageIndex'] = res.response.currentPageIndex + 1;
    params['pageSize'] = 8;
    this.baseParams$.next(params);
  }

  onResponse(res: SearchResponse): void {
    if (res.source === 'document-load-more') {
      this.append = false;
    }
  }

  private onChangeTab(): void {
    const subscription = this.tabInfo$.pipe(
      filter((info: TabInfo) => info.document && info.tabItem.name === this.item.name),
    ).subscribe((info: TabInfo) => {
      this.append = false;
      if (info.type === 'docChanged') {
        this.documents = [];
      }
      switch (info.tabItem.layout) {
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
        default:
          break;
      }
      if (this.documents.length === 0) {
        this.triggerSearch(info.document, this.item);
      }
      this.noResultText = 'No related ' + info.tabItem.name + ' found';
    });
    this.subscription.add(subscription);
  }

  private triggerSearch(doc: DocumentModel, item: any): void {
    this.searchFormSettings = new GlobalSearchFormSettings({
      source: 'document-load-more',
      searchGroupPosition: 'right',
      pageProvider: item.provider,
    });
    this.baseParams$.next(this.getSearchParams(doc, item));
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
        ecm_path: NUXEO_PATH_INFO.BACKSLASH_BASE_FOLDER_PATH,
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
}
