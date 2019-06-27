import { Component, OnInit, OnDestroy, Input, TemplateRef } from '@angular/core';
import { AdvanceSearch } from '@core/api';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { BaseSearchResultComponent } from './abstract-search-result';

@Component({
  selector: 'global-search-result',
  styleUrls: ['./global-search-result.component.scss'],
  templateUrl: './global-search-result.component.html',
})
export class GlobalSearchResultComponent extends BaseSearchResultComponent implements OnInit, OnDestroy {

  @Input() templateRef: TemplateRef<any>;
  @Input() layout: string = 'quarter';

  constructor(protected advanceSearch: AdvanceSearch, protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, queryParamsService);
  }

}
