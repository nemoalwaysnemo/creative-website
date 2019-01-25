import { Component, OnInit, OnDestroy } from '@angular/core';
import { DocumentModel, AdvanceSearch, NuxeoPageProviderParams } from '@core/api';
import { PaginationDataSource } from '../../shared/pagination/pagination-data-source';
import { ListViewItem, SearchQueryParamsService } from '../../shared';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tbwa-search-result',
  styleUrls: ['./search-result.component.scss'],
  templateUrl: './search-result.component.html',
})
export class SearchResultComponent implements OnInit, OnDestroy {

  layout = 'search-results';

  loading: boolean = false;

  currentView = 'thumbnailView';

  documents: DocumentModel[] = [];

  listDocuments: ListViewItem[] = [];

  totalResults = 0;

  paginationService: PaginationDataSource = new PaginationDataSource();

  listViewSettings: any = {
    columns: {
      title: {
        title: 'Title',
        sort: false,
      },
    },
  };

  queryParams: NuxeoPageProviderParams = {};

  private subscription: Subscription = new Subscription();

  constructor(private advanceSearch: AdvanceSearch, private queryParamsService: SearchQueryParamsService) { }

  ngOnInit() {
    this.onSearch();
    this.onPageChanged();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  changeToGridView() {
    this.currentView = 'thumbnailView';
  }

  changeToListView() {
    this.currentView = 'listView';
  }

  private onSearch(): void {
    const subscription = this.advanceSearch.onSearch().subscribe(({ response, queryParams, action }) => {
      if (action === 'beforeSearch') {
        this.loading = true;
        this.queryParams = queryParams;
      } else {
        this.loading = false;
        this.paginationService.from(response);
        this.totalResults = response.resultsCount;
        this.documents = response.entries;
        this.listDocuments = this.buildListViewItem(response.entries);
      }
    });
    this.subscription.add(subscription);
  }

  private onPageChanged() {
    const subscription = this.paginationService.onPageChanged().subscribe((pageInfo: any) => {
      const currentPageIndex = pageInfo.currentPageIndex;
      this.queryParamsService.changeQueryParams([], { currentPageIndex }, 'merge');
    });
    this.subscription.add(subscription);
  }

  private buildListViewItem(docs: DocumentModel[]): ListViewItem[] {
    const items = [];
    for (const doc of docs) {
      items.push(new ListViewItem({ uid: doc.uid, title: doc.title }));
    }
    return items;
  }

}
