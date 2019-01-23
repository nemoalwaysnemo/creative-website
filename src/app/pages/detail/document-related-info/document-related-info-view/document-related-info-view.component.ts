import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';
import { DocumentModel, AdvanceSearch, NuxeoPagination } from '@core/api';
import { DocumentRelatedInfoService } from '../document-related-info.service';
import { Environment, NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'tbwa-document-related-info-view',
  styleUrls: ['./document-related-info-view.component.scss'],
  templateUrl: './document-related-info-view.component.html',
})
export class DocumentRelatedInfoViewComponent implements OnInit, OnDestroy {

  @Input() item: any = {};

  @Input() document: DocumentModel;

  private search$: Subject<any> = new Subject<any>();

  loading = true;

  edgeLoading = false;

  documents: DocumentModel[] = [];

  backslashEdges: DocumentModel[] = [];

  queryField: FormControl = new FormControl();

  private subscription: Subscription = new Subscription();

  constructor(
    private advanceSearch: AdvanceSearch,
    private documentRelatedInfoService: DocumentRelatedInfoService) { }

  ngOnInit() {
    this.onSearch();
    this.onChangeTab();
    this.buildBackslashEdges();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onKeyup(event: KeyboardEvent) {
    this.loading = true;
    this.search$.next(this.getSearchParams());
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  getBackslashEdgeUrl(name: string) {
    return Environment.backslashAPPUrl + `/#/list/edge/${name}/`;
  }

  private onChangeTab(): void {
    const subscription = this.documentRelatedInfoService.onChangeTab()
      .pipe(
        filter((tabItem) => tabItem.name === this.item.name),
      )
      .subscribe(() => {
        if (this.documents.length === 0) {
          this.search$.next(this.getSearchParams());
        }
      });
    this.subscription.add(subscription);
  }

  private onSearch(): void {
    const subscription = this.search$.pipe(
      mergeMap((mapping) => {
        return this.advanceSearch.request(mapping.params, {}, mapping.provider);
      }),
    ).subscribe((res: NuxeoPagination) => {
      this.loading = false;
      this.documents = res.entries;
    });
    this.subscription.add(subscription);
  }

  private getSearchParams() {
    const params = Object.assign({ ecm_fulltext: this.queryField.value, ecm_uuid_exclude: this.document.uid }, this.item.params);
    if (this.item.hasOwnProperty('paramsMapping')) {
      const keys = Object.keys(this.item.paramsMapping);
      for (const key of keys) {
        const value = this.document.get(this.item.paramsMapping[key]);
        params[key] = typeof value === 'string' || !value ? `"${value}"` : `"${value.join('", "')}"`;
      }
    }
    return { params, provider: this.item.provider };
  }

  private getEdgesAggParams(): string {
    const edges = this.document.get('app_Edges:Tags_edges');
    return edges.length !== 0 ? `["${edges.join('", "')}"]` : '';
  }

  private buildBackslashEdges() {
    const edgesParams = this.getEdgesAggParams();
    if (edgesParams) {
      const params: any = {
        app_edges_active_article: true,
        quickFilters: 'BackslashEdgePage',
        app_edges_tags_edges: edgesParams,
        ecm_path: NUXEO_META_INFO.BACKSLASH_BASE_FOLDER_PATH,
      };
      this.edgeLoading = true;
      const subscription = this.advanceSearch.request(params).subscribe((res: NuxeoPagination) => {
        this.edgeLoading = false;
        this.backslashEdges = res.entries;
      });
      this.subscription.add(subscription);
    }
  }
}
