import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DocumentModel, GlobalSearchParams, SearchResponse } from '@core/api';
import { GlobalSearchFormService } from '../global-search-form/global-search-form.service';
import { DocumentListViewItem } from '../document-list-view/document-list-view.interface';
import { DocumentPageService } from '../services/document-page.service';
import { BaseSearchResultComponent } from './base-search-result.component';
import { PaginationDataSource } from '../pagination/pagination-data-source';
import { concatMap, filter } from 'rxjs/operators';

@Component({
  template: '',
})
export class BaseGlobalSearchResultComponent extends BaseSearchResultComponent {

  @Input()
  set listViewSettings(settings: any) {
    if (settings) {
      this.listViewOptions = settings;
    }
  }

  constructor(
    protected documentPageService: DocumentPageService,
    protected globalSearchFormService: GlobalSearchFormService,
  ) {
    super(documentPageService);
  }

  loading: boolean = true;

  layout: string = 'search-results';

  documents: DocumentModel[] = [];

  listDocuments: DocumentListViewItem[] = [];

  totalResults: number = 0;

  listViewOptions: any = {};

  hasNextPage: boolean = false;

  searchParams: GlobalSearchParams = new GlobalSearchParams();

  protected paginationService: PaginationDataSource = new PaginationDataSource();

  protected searchResponse: SearchResponse;

  protected currentPageIndex: number = 0;

  protected canScrollDown: boolean = false;

  @Input() append: boolean = false;

  @Input() enableScrolling: boolean = true;

  @Output() onResponse: EventEmitter<SearchResponse> = new EventEmitter<SearchResponse>();

  @Input() searchResultFilter: (res: SearchResponse) => boolean = (res: SearchResponse) => res.source === 'global-search-form';

  @Input() listViewBuilder: (documents: DocumentModel[]) => any[] = (documents: DocumentModel[]) => documents;

  protected onInit(): void {
    this.onSearch();
    this.onPageChanged();
  }

  protected onSearch(): void {
    const subscription = this.globalSearchFormService.onSearch().pipe(
      filter((res: SearchResponse) => this.searchResultFilter(res)),
      concatMap((res: SearchResponse) => this.afterSearch(res)),
    ).subscribe((res: SearchResponse) => {
      if (res.action === 'beforeSearch') {
        this.triggerLoading(true, res.searchParams);
      } else {
        this.triggerLoading(false, res.searchParams);
        this.searchParams = res.searchParams;
        this.onResponse.emit(res);
        this.performResponse(res);
      }
    });
    this.subscription.add(subscription);
  }

  protected triggerLoading(loading: boolean, searchParams: GlobalSearchParams): void {
    if (typeof searchParams.getSettings('enableLoading') === 'undefined' || searchParams.getSettings('enableLoading')) {
      this.loading = loading;
    }
  }

  protected onPageChanged(): void {
    const subscription = this.paginationService.onPageChanged().subscribe((info: any) => {
      this.globalSearchFormService.changePageIndex(info.currentPageIndex, 24, { trigger: 'onPageChanged' });
    });
    this.subscription.add(subscription);
  }

  onScrollDown(): void {
    if (this.enableScrolling && this.currentView === 'thumbnailView' && !this.loading && this.canScrollDown) {
      const nextPageIndex = this.currentPageIndex > 0 ? this.currentPageIndex + 1 : 4;
      this.globalSearchFormService.changePageIndex(nextPageIndex, 6, { append: true, enableLoading: false, trigger: 'onScrollDown' });
    }
  }

  protected performResponse(res: SearchResponse): void {
    this.searchResponse = res;
    this.totalResults = res.response.resultsCount;
    this.hasNextPage = res.response.isNextPageAvailable;
    if (res.searchParams.getSettings('trigger') === 'onPageChanged') {
      this.performListView(res);
    } else if (res.searchParams.getSettings('trigger') === 'onScrollDown') {
      this.performThumbnailView(res);
    } else {
      this.performListView(res);
      this.performThumbnailView(res);
    }
  }

  protected performListView(res: SearchResponse): void {
    this.paginationService.from(res.response);
    this.listDocuments = this.listViewBuilder(res.response.entries);
  }

  protected performThumbnailView(res: SearchResponse): void {
    this.canScrollDown = res.response.isNextPageAvailable;
    this.currentPageIndex = res.response.currentPageIndex;
    if (this.append === true || res.searchParams.getSettings('append')) {
      this.documents = this.documents.concat(res.response.entries);
    } else {
      this.documents = res.response.entries;
    }
  }
}
