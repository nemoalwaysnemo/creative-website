import { Input, OnInit, OnDestroy } from '@angular/core';
import { DocumentModel, AdvanceSearch, NuxeoPageProviderParams } from '@core/api';
import { Subscription } from 'rxjs';
import { PaginationDataSource } from '../pagination/pagination-data-source';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { ListViewItem } from '../list-view/list-view.interface';

export abstract class BaseSearchResultComponent implements OnInit, OnDestroy {

  loading: boolean = false;

  layout: string = 'search-results';

  documents: DocumentModel[] = [];

  listDocuments: ListViewItem[] = [];

  totalResults: number = 0;

  listViewSetting: any = {};

  paginationService: PaginationDataSource = new PaginationDataSource();

  queryParams: NuxeoPageProviderParams = {};

  protected multiView: boolean = false;

  protected subscription: Subscription = new Subscription();

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
    const subscription = this.advanceSearch.onSearch().subscribe(({ response, queryParams, action }) => {
      if (action === 'beforeSearch') {
        this.loading = true;
      } else {
        this.loading = false;
        this.queryParams = queryParams;
        this.paginationService.from(response);
        this.totalResults = response.resultsCount;
        this.documents = response.entries;
        this.listDocuments = this.listViewBuilder(response.entries);
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

}
