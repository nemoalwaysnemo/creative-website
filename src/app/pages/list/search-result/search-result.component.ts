import { Component, OnInit } from '@angular/core';
import { NuxeoPagination, DocumentModel, AdvanceSearch } from '@core/api';

@Component({
  selector: 'tbwa-search-result',
  styleUrls: ['./search-result.component.scss'],
  templateUrl: './search-result.component.html',
})
export class SearchResultComponent implements OnInit {

  constructor(private advanceSearch: AdvanceSearch) { }

  layout = 'search-results';
  documents: DocumentModel[];
  searchTerm: string;
  totalResults = 100;
  gridView = true;

  ngOnInit() {
    this.onSearch();
  }

  changeToGridView() {
    this.gridView = true;
    location.reload();
  }

  changeToListView() {
    this.gridView = false;
    location.reload();
  }

  private onSearch(): void {
    this.advanceSearch.onSearch().subscribe(({ response, queryParams, opts }) => {
      this.searchTerm = queryParams.ecm_fulltext;
      this.totalResults = response.resultsCount;
      this.documents = response.entries;
      console.log(2222, response, queryParams, opts);
    });
  }
}
