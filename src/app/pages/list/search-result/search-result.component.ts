import { Component, OnInit } from '@angular/core';
import { DocumentModel, AdvanceSearch, NuxeoPageProviderParams } from '@core/api';
import { PaginationDataSource } from '@pages/shared/pagination/pagination-data-source';

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
  listDocuments: any;

  totalResults = 0;

  paginationService: PaginationDataSource = new PaginationDataSource();

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
  }

  private onSearch(): void {
    this.advanceSearch.onSearch().subscribe(({ response, queryParams, opts }) => {
      this.paginationService.from(response);
      this.queryParams = queryParams;
      this.totalResults = response.resultsCount;
      this.documents = response.entries;
      this.listDocuments = this.setListDocuments(response.entries);
    });
  }

  private onPageChanged() {
    this.paginationService.onPageChanged().subscribe((pageInfo: any) => {
      this.queryParams.currentPageIndex = pageInfo.currentPageIndex;
      this.advanceSearch.search(this.queryParams);
    });
  }

  private setListDocuments(entries: DocumentModel[]) {
    const data = [];
    for (const entry of entries) {
      data.push({ img: entry.thumbnailUrl, title: entry.title, date: 2018, description: 'McDonald\'s', agency: 'TBWA\\Chiat\\Day' });
    }
    return data;
  }
}
