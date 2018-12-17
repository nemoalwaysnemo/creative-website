import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdvanceSearchDataSource } from '@pages/shared';
import { NuxeoPagination } from '@core/api';

@Component({
  selector: 'tbwa-search-filter',
  styleUrls: ['./search-filter.component.scss'],
  templateUrl: './search-filter.component.html',
})
export class SearchFilterComponent implements OnInit, OnDestroy {

  private alive: boolean = true;

  constructor(private searchDataSource: AdvanceSearchDataSource) {

  }

  ngOnInit() {
    this.searchDataSource.requestSearchFilters().subscribe((res: NuxeoPagination) => {
      console.log(res);
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
