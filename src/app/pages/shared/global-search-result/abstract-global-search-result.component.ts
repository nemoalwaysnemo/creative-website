import { Input } from '@angular/core';
import { DocumentModel, AdvanceSearch, NuxeoPageProviderParams, SearchResponse } from '@core/api';
import { PaginationDataSource } from '../pagination/pagination-data-source';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { DocumentListViewItem } from '../document-list-view/document-list-view.interface';
import { concatMap } from 'rxjs/operators';
import { AbstractSearchResultComponent } from './abstract-search-result.component';

export abstract class AbstractGlobalSearchResultComponent extends AbstractSearchResultComponent {

  loading: boolean = false;

  layout: string = 'search-results';

  documents: DocumentModel[] = [];

  listDocuments: DocumentListViewItem[] = [];

  totalResults: number = 0;

  listViewSetting: any = {};

  paginationService: PaginationDataSource = new PaginationDataSource();

  searchParams: NuxeoPageProviderParams = new NuxeoPageProviderParams();

  multiView: boolean = false;

  @Input() currentView: string = 'thumbnailView';

  @Input()
  set listViewSettings(settings: any) {
    if (settings) {
      this.multiView = true;
      this.listViewSetting = settings;
    }
  }

  @Input() listViewBuilder: Function = (documents: DocumentModel[]) => { };

  constructor(protected advanceSearch: AdvanceSearch, protected queryParamsService: SearchQueryParamsService) {
    super(queryParamsService);
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

  protected handleResponse(res: SearchResponse): void {
    this.paginationService.from(res.response);
    this.totalResults = res.response.resultsCount;
    this.documents = res.response.entries;
    this.listDocuments = this.listViewBuilder(res.response.entries);
  }

}
