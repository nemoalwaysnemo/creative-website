import { Input, OnInit, OnDestroy } from '@angular/core';
import { SearchResponse } from '@core/api';
import { Observable, of as observableOf, Subscription } from 'rxjs';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { Params } from '@angular/router';

export abstract class AbstractSearchResultComponent implements OnInit, OnDestroy {

  queryParams: Params = {};

  protected subscription: Subscription = new Subscription();

  @Input() afterSearch: Function = (res: SearchResponse): Observable<SearchResponse> => observableOf(res);

  constructor(protected queryParamsService: SearchQueryParamsService) {

  }

  ngOnInit(): void {
    this.onInit();
  }

  ngOnDestroy(): void {
    this.onDestroy();
  }

  protected abstract onInit(): void;

  protected onDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected onQueryParamsChanged(): void {
    const subscription = this.queryParamsService.onQueryParamsChanged().subscribe((params: Params) => {
      this.queryParams = params;
    });
    this.subscription.add(subscription);
  }

}
