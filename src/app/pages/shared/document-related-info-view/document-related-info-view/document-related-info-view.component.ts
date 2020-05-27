import { Component, Input, TemplateRef, ViewChild, OnInit, OnDestroy, Type } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { filter, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DocumentModel, AdvanceSearchService, NuxeoPagination, NuxeoQuickFilters, SearchFilterModel } from '@core/api';
import { GlobalDocumentDialogService } from '../../global-document-dialog/global-document-dialog.service';
import { GlobalDocumentDialogSettings } from '../../global-document-dialog/global-document-dialog.interface';
import { GlobalSearchFormSettings } from '../../global-search-form/global-search-form.interface';
import { DocumentModelForm } from '../../global-document-form/global-document-form.component';
import { GLOBAL_DOCUMENT_DIALOG } from '../../global-document-dialog';
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

  private search$: Subject<any> = new Subject<any>();

  protected subscription: Subscription = new Subscription();

  loading: boolean = true;

  thumbnailItemView: TemplateRef<any>;

  edgeLoading: boolean = true;

  document: DocumentModel;

  documents: DocumentModel[] = [];

  backslashEdges: DocumentModel[] = [];

  queryField: FormControl = new FormControl();

  noResultText: string;

  dialogMetadata: any = {
    enablePreview: true,
    enableEdit: false,
    enableDeletion: false,
    moreInfo: true,
  };

  backslashTitle: string = 'Backslash';

  disruptionTitle: string = 'Disruption';

  intelligenceTitle: string = 'Intelligence';

  baseParams$: Subject<any> = new Subject<any>();

  searchMoreParams$: Subject<any> = new Subject<any>();

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    searchGroupPosition: 'right',
  });

  pageSize: number = 8;

  backslashFilters: SearchFilterModel[] = [
    new SearchFilterModel({ key: 'app_edges_tags_edges_agg', placeholder: 'Edges' }),
    new SearchFilterModel({ key: 'app_edges_backslash_category_agg', placeholder: 'Category' }),
    new SearchFilterModel({ key: 'app_edges_backslash_type', placeholder: 'Type' }),
    new SearchFilterModel({ key: 'the_loupe_main_brand_agg', placeholder: 'Brand' }),
    new SearchFilterModel({ key: 'app_edges_relevant_country', placeholder: 'Geography', iteration: true }),
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
    new SearchFilterModel({ key: 'app_edges_industry_agg', placeholder: 'Industry', iteration: true }),
    new SearchFilterModel({ key: 'the_loupe_main_country_agg', placeholder: 'Country', iteration: true }),
    new SearchFilterModel({ key: 'the_loupe_main_brand_agg', placeholder: 'Brand' }),
    new SearchFilterModel({ key: 'app_Edges:intelligence_type', placeholder: 'Intelligence Type' }),
    new SearchFilterModel({ key: 'the_loupe_main_agency_agg', placeholder: 'Agency' }),
    new SearchFilterModel({ key: 'app_Edges:backslash_category', placeholder: 'Backslash Category' }),
    new SearchFilterModel({ key: 'app_edges_tags_edges_agg', placeholder: 'Edges' }),
  ];

  filters: SearchFilterModel[] = [];

  constructor(
    private advanceSearchService: AdvanceSearchService,
    private globalDocumentDialogService: GlobalDocumentDialogService,
  ) { }

  ngOnInit(): void {
    this.onSearch();
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

  private onChangeTab(): void {
    const subscription = this.tabInfo$.pipe(
      filter((info: TabInfo) => info.document && info.tabItem.name === this.item.name),
    ).subscribe((info: TabInfo) => {
      this.pageSize = 8;
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
      if (info.type === 'docChanged') {
        this.documents = [];
      }
      if (this.documents.length === 0) {
        this.search$.next(this.getSearchParams(info.document));
      }

      this.noResultText = 'No related ' + info.tabItem.name + ' found';
    });
    this.subscription.add(subscription);
  }

  private onSearch(): void {
    const subscription = this.search$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(_ => {
        this.loading = true;
      }),
    ).subscribe((res: any) => {
      this.searchFormSettings.pageProvider = res.provider;
      this.baseParams$.next(res.params);
    });
    this.subscription.add(subscription);
  }

  loadMore(): void {
    this.pageSize += 8;
    this.searchMoreParams$.next({ pageSize: this.pageSize });
  }

  private getSearchParams(doc: DocumentModel): any {
    const params = Object.assign({ ecm_fulltext: this.queryField.value, ecm_uuid_not_eq: doc.uid }, this.item.params);
    if (this.item.hasOwnProperty('paramsMapping')) {
      const keys = Object.keys(this.item.paramsMapping);
      for (const key of keys) {
        const value = doc.get(this.item.paramsMapping[key]);
        params[key] = typeof value === 'string' || !value ? `"${value}"` : `"${value.join('", "')}"`;
      }
    }
    return { params, provider: this.item.provider };
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
      const subscription = this.advanceSearchService.request(params).subscribe((res: NuxeoPagination) => {
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
