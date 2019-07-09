import { Component, OnInit, OnDestroy, Input, TemplateRef } from '@angular/core';
import { AdvanceSearch, SearchResponse } from '@core/api';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { BaseSearchResultComponent } from './abstract-search-result';

@Component({
  selector: 'global-search-result',
  styleUrls: ['./global-search-result.component.scss'],
  templateUrl: './global-search-result.component.html',
})
export class GlobalSearchResultComponent extends BaseSearchResultComponent implements OnInit, OnDestroy {

  @Input() responseHandler: Function = (res: SearchResponse): SearchResponse => res;

  @Input() templateRef: TemplateRef<any>;

  @Input() hasPagination: boolean = true;

  @Input() layout: string = 'quarter';

  constructor(protected advanceSearch: AdvanceSearch, protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, queryParamsService);
  }

  protected handleResponse(res: SearchResponse): void {
    const response = this.responseHandler(res);
    super.handleResponse(response);
  }

}
