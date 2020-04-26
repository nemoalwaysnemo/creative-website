import { Component, Input, TemplateRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { TabInfo } from '../document-related-info.component';
import { GlobalDocumentDialogService } from '../../global-document-dialog/global-document-dialog.service';
import { filter, mergeMap, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DocumentModel, AdvanceSearch, NuxeoPagination, NuxeoQuickFilters } from '@core/api';
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

  constructor(
    private advanceSearch: AdvanceSearch,
    private globalDocumentDialogService: GlobalDocumentDialogService,
  ) { }

  ngOnInit() {
    this.onSearch();
    this.onChangeTab();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  open(dialog: TemplateRef<any>, doc: DocumentModel, type: string) {
    // this.globalDocumentDialogService.open(dialog, doc, { title: type });
  }

  onKeyup(event: KeyboardEvent) {
    this.search$.next(this.getSearchParams(this.document));
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  getBackslashEdgeUrl(name: string) {
    return Environment.backslashAppUrl + `/#/list/edge/${name}/`;
  }

  private onChangeTab(): void {
    const subscription = this.tabInfo$.pipe(
      filter((info: TabInfo) => info.document && info.tabItem.name === this.item.name),
    ).subscribe((info: TabInfo) => {
      switch (info.tabItem.layout) {
        case 'backslash':
          this.buildBackslashEdges(info.document);
          this.thumbnailItemView = this.backslashItemView;
          break;
        case 'disruption':
          this.thumbnailItemView = this.disruptionItemView;
          break;
        case 'intelligence':
          this.thumbnailItemView = this.intelligenceItemView;
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
      mergeMap((mapping) => {
        return this.advanceSearch.request(mapping.params, null, mapping.provider);
      }),
    ).subscribe((res: NuxeoPagination) => {
      this.loading = false;
      this.documents = res.entries;
    });
    this.subscription.add(subscription);
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
      const subscription = this.advanceSearch.request(params).subscribe((res: NuxeoPagination) => {
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
