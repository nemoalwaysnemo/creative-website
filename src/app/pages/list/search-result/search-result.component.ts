import { Component, OnInit } from '@angular/core';
import { NuxeoPagination, DocumentModel } from '@core/api';
import { Location } from '@angular/common';

@Component({
  selector: 'tbwa-search-result',
  styleUrls: ['./search-result.component.scss'],
  templateUrl: './search-result.component.html',
})
export class SearchResultComponent implements OnInit {

  constructor(private location: Location) { }

  layout = 'search-results';
  brandDocuments: DocumentModel[];
  title = 'Thomson Reuters';
  total_results = 100;
  grid_view = true;

  ngOnInit() {

  }

  changToGridView() {
    this.grid_view = true;
    location.reload();
  }

  changToListView() {
    this.grid_view = false;
    location.reload();
  }
}
