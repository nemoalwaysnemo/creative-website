import { Input } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { DocumentModel, AdvanceSearch, NuxeoPageProviderParams, SearchResponse } from '@core/api';
import { PaginationDataSource } from '../pagination/pagination-data-source';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { DocumentListViewItem } from '../document-list-view/document-list-view.interface';
import { concatMap } from 'rxjs/operators';
import { AbstractSearchResultComponent } from './abstract-search-result.component';
import { ActivatedRoute } from '@angular/router';
export abstract class AbstractGlobalSearchResultComponent extends AbstractSearchResultComponent {

  loading: boolean = false;

  layout: string = 'search-results';

  documents: DocumentModel[] = [];

  listDocuments: DocumentListViewItem[] = [];

  totalResults: number = 0;

  listViewSetting: any = {};

  paginationService: PaginationDataSource = new PaginationDataSource();

  searchParams: NuxeoPageProviderParams = new NuxeoPageProviderParams();

  hasNextPage: boolean = true;

  @Input()
  set listViewSettings(settings: any) {
    if (settings) {
      this.listViewSetting = settings;
    }
  }

  @Input() listViewBuilder: Function = (documents: DocumentModel[]) => { };

  constructor(protected advanceSearch: AdvanceSearch, protected queryParamsService: SearchQueryParamsService, protected route: ActivatedRoute, protected viewportScroller: ViewportScroller) {
    super(queryParamsService);
  }

  protected onInit(): void {
    this.onSearch();
    this.onPageChanged();
  }

  protected onSearch(): void {
    const subscription = this.advanceSearch.onSearch().pipe(
      concatMap((res: SearchResponse) => this.afterSearch(res)),
    ).subscribe((res: SearchResponse) => {
      if (res.action === 'beforeSearch') {
        this.loading = true;
      } else {
        this.loading = false;
        this.searchParams = res.searchParams;
        this.handleResponse(res);
      }
    });
    this.subscription.add(subscription);
  }

  protected onPageChanged(): void {
    const subscription = this.paginationService.onPageChanged().subscribe((pageInfo: any) => {
      const currentPageIndex = pageInfo.currentPageIndex;
      this.queryParamsService.changeQueryParams({ currentPageIndex }, { type: 'pagination' }, 'merge');
    });
    this.subscription.add(subscription);
  }

  protected onScroll() {
    if (this.currentView === 'thumbnailView' && !this.loading && this.hasNextPage) {
      const currentPageIndex = parseInt(this.route.snapshot.queryParams.currentPageIndex || 0, 10) + 1;
      this.queryParamsService.changeQueryParams({ currentPageIndex }, { type: 'scroll' }, 'merge');
    }
  }

  protected handleResponse(res: SearchResponse): void {
    !res.response.isNextPageAvailable ? this.hasNextPage = false : '';
    const pageSize = res.response.pageSize;
    this.paginationService.from(res.response);
    this.totalResults = res.response.resultsCount;
    this.documents = this.documents.concat(res.response.entries);
    const destinationAnchor = 'scroll-anchor-' + (this.documents.length - pageSize - 1);
    this.viewportScroller.scrollToAnchor(destinationAnchor);
    this.listDocuments = this.listViewBuilder(res.response.entries.slice(res.response.entries.length - pageSize));
  }
}
