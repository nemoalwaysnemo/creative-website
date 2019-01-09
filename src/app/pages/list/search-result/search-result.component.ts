import { Component, OnInit } from '@angular/core';
import { DocumentModel, AdvanceSearch, NuxeoPageProviderParams } from '@core/api';
import { PaginationDataSource } from '@pages/shared/pagination/pagination-data-source';
import { ListViewItem } from '@pages/shared';

@Component({
  selector: 'tbwa-search-result',
  styleUrls: ['./search-result.component.scss'],
  templateUrl: './search-result.component.html',
})
export class SearchResultComponent implements OnInit {

  constructor(private advanceSearch: AdvanceSearch) { }

  layout = 'search-results';

  currentView = 'thumbnailView';

  documents: DocumentModel[];

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

  private queryParams: NuxeoPageProviderParams = {};

  ngOnInit() {
    this.onSearch();
    this.onPageChanged();
  }

  changeToGridView() {
    this.currentView = 'thumbnailView';
  }

  changeToListView() {
    this.currentView = 'listView';
    this.listDocuments = this.buildListViewItem(this.documents);
  }

  private onSearch(): void {
    this.advanceSearch.onSearch().subscribe(({ response, queryParams, opts }) => {
      this.paginationService.from(response);
      this.queryParams = queryParams;
      this.totalResults = response.resultsCount;
      this.documents = response.entries;
    });
  }

  private onPageChanged() {
    this.paginationService.onPageChanged().subscribe((pageInfo: any) => {
      this.queryParams.currentPageIndex = pageInfo.currentPageIndex;
      this.advanceSearch.search(this.queryParams);
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
