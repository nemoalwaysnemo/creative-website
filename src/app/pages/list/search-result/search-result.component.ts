import { Component, OnInit } from '@angular/core';
import { DocumentModel, AdvanceSearch, NuxeoPageProviderParams } from '@core/api';
import { PaginationDataSource } from '@pages/shared/pagination/pagination-data-source';
import { ListViewItem, SearchQueryParamsService } from '@pages/shared';

@Component({
  selector: 'tbwa-search-result',
  styleUrls: ['./search-result.component.scss'],
  templateUrl: './search-result.component.html',
})
export class SearchResultComponent implements OnInit {

  constructor(private advanceSearch: AdvanceSearch, private queryParamsService: SearchQueryParamsService) { }

  layout = 'search-results';

  currentView = 'thumbnailView';

  documents: DocumentModel[] = [];

  listDocuments: ListViewItem[];

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

  ngOnInit() {
    this.onSearch();
    this.onPageChanged();
  }

  changeToGridView() {
    this.currentView = 'thumbnailView';
  }

  changeToListView() {
    this.currentView = 'listView';
  }

  private onSearch(): void {
    this.advanceSearch.onSearch().subscribe(({ response, queryParams }) => {
      this.paginationService.from(response);
      this.queryParams = queryParams;
      this.totalResults = response.resultsCount;
      this.documents = response.entries;
      this.listDocuments = this.buildListViewItem(response.entries);
    });
  }

  private onPageChanged() {
    this.paginationService.onPageChanged().subscribe((pageInfo: any) => {
      const currentPageIndex = pageInfo.currentPageIndex;
      this.queryParamsService.changeQueryParams([], { currentPageIndex }, 'merge');
    });
  }

  private buildListViewItem(docs: DocumentModel[]): ListViewItem[] {
    const items = [];
    for (const doc of docs) {
      items.push(new ListViewItem({ uid: doc.uid, title: doc.title }));
    }
    return items;
  }

}
