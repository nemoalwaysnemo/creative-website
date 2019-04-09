import { DocumentModel, AdvanceSearch, NuxeoPageProviderParams } from '@core/api';
import { PaginationDataSource } from '../pagination/pagination-data-source';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { ListViewItem } from '../list-view/list-view.interface';
import { Subscription } from 'rxjs';

export abstract class BaseSearchResultComponent {

  loading: boolean = false;

  layout: string = 'search-results';

  currentView: string = 'thumbnailView';

  documents: DocumentModel[] = [];

  listDocuments: ListViewItem[] = [];

  totalResults: number = 0;

  paginationService: PaginationDataSource = new PaginationDataSource();

  queryParams: NuxeoPageProviderParams = {};

  protected subscription: Subscription = new Subscription();

  constructor(protected advanceSearch: AdvanceSearch, protected queryParamsService: SearchQueryParamsService) {
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
    const subscription = this.advanceSearch.onSearch().subscribe(({ response, queryParams, action }) => {
      if (action === 'beforeSearch') {
        this.loading = true;
      } else {
        this.loading = false;
        this.queryParams = queryParams;
        this.paginationService.from(response);
        this.totalResults = response.resultsCount;
        this.documents = response.entries;
        this.listDocuments = this.buildListViewItem(response.entries);
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

  protected abstract getListViewSettings(): any;

  protected abstract buildListViewItem(docs: DocumentModel[]): ListViewItem[];

}
