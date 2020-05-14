import { Input } from '@angular/core';
import { DocumentModel, AdvanceSearch, NuxeoPageProviderParams, SearchResponse } from '@core/api';
import { DocumentListViewItem } from '../document-list-view/document-list-view.interface';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { AbstractSearchResultComponent } from './abstract-search-result.component';
import { PaginationDataSource } from '../pagination/pagination-data-source';
import { concatMap } from 'rxjs/operators';

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
      this.documents = [];
      const currentPageIndex = pageInfo.currentPageIndex;
      this.queryParamsService.changeQueryParams({ currentPageIndex }, { type: 'pagination' }, 'merge');
    });
    this.subscription.add(subscription);
  }

  onScrollDown(): void {
    // if (this.currentView === 'thumbnailView' && !this.loading && this.hasNextPage) {
    //   const pageIndex: string = this.queryParamsService.getSnapshotQueryParamMap().get('currentPageIndex');
    //   const currentPageIndex: number = parseInt(pageIndex || '0', 10) + 1;
    //   this.queryParamsService.changeQueryParams({ currentPageIndex }, { type: 'scroll' }, 'merge');
    // }
  }

  protected handleResponse(res: SearchResponse): void {
    this.hasNextPage = res.response.isNextPageAvailable;
    this.paginationService.from(res.response);
    this.totalResults = res.response.resultsCount;
    if (this.queryParamsService.getSnapshotQueryParamMap().has('currentPageIndex')) {
      this.documents = this.documents.concat(res.response.entries);
    } else {
      this.documents = res.response.entries;
    }
    const offset = res.searchParams.pageSize % 20 === 0 ? -20 : - (res.searchParams.pageSize % 20 === 0);
    this.listDocuments = this.listViewBuilder(res.response.entries.slice(offset));
  }
}
