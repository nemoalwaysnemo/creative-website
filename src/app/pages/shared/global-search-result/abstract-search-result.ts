import { Input, OnInit, OnDestroy } from '@angular/core';
import { DocumentModel, AdvanceSearch, NuxeoPageProviderParams, SearchResponse } from '@core/api';
import { Subscription, Observable, of as observableOf } from 'rxjs';
import { PaginationDataSource } from '../pagination/pagination-data-source';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { DocumentListViewItem } from '../document-list-view/document-list-view.interface';
import { concatMap } from 'rxjs/operators';

export abstract class BaseSearchResultComponent implements OnInit, OnDestroy {

  loading: boolean = false;

  layout: string = 'search-results';

  documents: DocumentModel[] = [];

  listDocuments: DocumentListViewItem[] = [];

  totalResults: number = 0;

  listViewSetting: any = {};

  paginationService: PaginationDataSource = new PaginationDataSource();

  queryParams: NuxeoPageProviderParams = new NuxeoPageProviderParams();

  multiView: boolean = false;

  protected subscription: Subscription = new Subscription();

  @Input() currentView: string = 'thumbnailView';

  @Input() afterSearch: Function = (res: SearchResponse): Observable<SearchResponse> => observableOf(res);

  @Input()
  set listViewSettings(settings: any) {
    if (settings) {
      this.multiView = true;
      this.listViewSetting = settings;
    }
  }

  @Input() listViewBuilder: Function = (documents: DocumentModel[]) => { };

  constructor(protected advanceSearch: AdvanceSearch, protected queryParamsService: SearchQueryParamsService) {
  }

  ngOnInit(): void {
    this.onInit();
  }

  ngOnDestroy(): void {
    this.onDestroy();
  }

  changeToGridView(): void {
    this.currentView = 'thumbnailView';
  }

  changeToListView(): void {
    this.currentView = 'listView';
  }

  protected onInit(): void {
    this.onSearch();
    this.onPageChanged();
  }

  protected onDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected onSearch(): void {
    const subscription = this.advanceSearch.onSearch().pipe(
      concatMap((res: SearchResponse) => this.afterSearch(res)),
    ).subscribe((res: SearchResponse) => {
      if (res.action === 'beforeSearch') {
        this.loading = true;
      } else {
        this.loading = false;
        this.queryParams = res.queryParams;
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

  protected handleResponse(res: SearchResponse): void {
    this.paginationService.from(res.response);
    this.totalResults = res.response.resultsCount;
    this.documents = res.response.entries;
    this.listDocuments = this.listViewBuilder(res.response.entries);
  }

}
