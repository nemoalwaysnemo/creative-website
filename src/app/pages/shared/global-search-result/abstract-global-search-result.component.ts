import { Input } from '@angular/core';
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

  hasNextPage: boolean = false;

  @Input()
  set listViewSettings(settings: any) {
    if (settings) {
      this.listViewSetting = settings;
    }
  }

  @Input() listViewBuilder: Function = (documents: DocumentModel[]) => { };

  constructor(protected advanceSearch: AdvanceSearch, protected queryParamsService: SearchQueryParamsService) {
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
      const queryParams = Object.assign({}, this.queryParamsService.getSnapshotQueryParams(), { currentPageIndex });
      delete queryParams['infiniteScroll'];
      this.queryParamsService.changeQueryParams(queryParams, { type: 'pagination' });
    });
    this.subscription.add(subscription);
  }

  onScrollDown(): void {
    if (this.currentView === 'thumbnailView' && !this.loading && this.hasNextPage) {
      const infiniteScroll: boolean = true;
      const pageIndex: string = this.queryParamsService.getSnapshotQueryParamMap().get('currentPageIndex');
      const currentPageIndex: number = parseInt(pageIndex || '0', 10) + 1;
      this.queryParamsService.changeQueryParams({ currentPageIndex, infiniteScroll }, { type: 'scroll' }, 'merge');
    }
  }

  protected handleResponse(res: SearchResponse): void {
    this.hasNextPage = res.response.isNextPageAvailable;
    this.paginationService.from(res.response);
    this.totalResults = res.response.resultsCount;
    if (this.queryParamsService.getSnapshotQueryParamMap().has('infiniteScroll')) {
      this.documents = this.documents.concat(res.response.entries);
    } else {
      this.documents = res.response.entries;
    }
    this.listDocuments = this.listViewBuilder(res.searchParams.pageSize > 20 ? res.response.entries.slice(-20) : res.response.entries);
  }
}
