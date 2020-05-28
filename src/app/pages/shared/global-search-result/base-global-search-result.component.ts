import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DocumentModel, NuxeoPageProviderParams, SearchResponse } from '@core/api';
import { GlobalSearchFormService } from '../global-search-form/global-search-form.service';
import { DocumentListViewItem } from '../document-list-view/document-list-view.interface';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { BaseSearchResultComponent } from './base-search-result.component';
import { PaginationDataSource } from '../pagination/pagination-data-source';
import { concatMap, filter } from 'rxjs/operators';

@Component({
  template: '',
})
export class BaseGlobalSearchResultComponent extends BaseSearchResultComponent {

  loading: boolean = false;

  layout: string = 'search-results';

  documents: DocumentModel[] = [];

  listDocuments: DocumentListViewItem[] = [];

  totalResults: number = 0;

  listViewOptions: any = {};

  paginationService: PaginationDataSource = new PaginationDataSource();

  searchParams: NuxeoPageProviderParams = new NuxeoPageProviderParams();

  hasNextPage: boolean = false;

  private searchResponse: SearchResponse;

  @Input()
  set listViewSettings(settings: any) {
    if (settings) {
      this.listViewOptions = settings;
    }
  }

  @Input() listViewBuilder: Function = (documents: DocumentModel[]): any[] => documents;

  @Output() onResponse = new EventEmitter<SearchResponse>();

  constructor(
    protected queryParamsService: SearchQueryParamsService,
    protected globalSearchFormService: GlobalSearchFormService,
  ) {
    super(queryParamsService);
  }

  protected onInit(): void {
    this.onSearch();
    this.onPageChanged();
  }

  protected onSearch(): void {
    const subscription = this.globalSearchFormService.onSearch().pipe(
      filter((res: SearchResponse) => res.metadata.source === 'global-search-form'),
      concatMap((res: SearchResponse) => this.afterSearch(res)),
    ).subscribe((res: SearchResponse) => {
      if (res.action === 'beforeSearch') {
        this.loading = true;
      } else {
        this.loading = false;
        this.searchParams = res.searchParams;
        this.onResponse.emit(res);
        this.handleResponse(res);
      }
    });
    this.subscription.add(subscription);
  }

  protected onPageChanged(): void {
    const subscription = this.paginationService.onPageChanged().subscribe((info: any) => {
      this.documents = [];
      this.globalSearchFormService.changePageIndex(info.currentPageIndex, { actionType: 'pagination' });
    });
    this.subscription.add(subscription);
  }

  onScrollDown(): void {
    if (this.currentView === 'thumbnailView' && !this.loading && this.hasNextPage) {
      const pageIndex: number = this.searchResponse.response.currentPageIndex;
      this.globalSearchFormService.changePageIndex(pageIndex + 1, { actionType: 'onScrollDown' });
    }
  }

  protected handleResponse(res: SearchResponse): void {
    this.searchResponse = res;
    this.hasNextPage = res.response.isNextPageAvailable;
    this.paginationService.from(res.response);
    this.totalResults = res.response.resultsCount;
    if (res.metadata.actionType === 'onScrollDown') {
      this.documents = this.documents.concat(res.response.entries);
    } else {
      this.documents = res.response.entries;
    }
    const offset = res.searchParams.pageSize % 20 === 0 ? -20 : - (res.searchParams.pageSize % 20 === 0);
    this.listDocuments = this.listViewBuilder(res.response.entries.slice(offset));
  }
}
