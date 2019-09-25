import { Component, Input, TemplateRef } from '@angular/core';
import { AdvanceSearch } from '@core/api';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { AbstractGlobalSearchResultComponent } from './abstract-global-search-result.component';
import { ActivatedRoute } from '@angular/router';
import { ViewportScroller } from '@angular/common';
@Component({
  selector: 'global-search-result',
  styleUrls: ['./global-search-result.component.scss'],
  templateUrl: './global-search-result.component.html',
})
export class GlobalSearchResultComponent extends AbstractGlobalSearchResultComponent {

  @Input() templateRef: TemplateRef<any>;

  @Input() hasPagination: boolean = true;

  @Input() layout: string = 'disruption_home';

  @Input() hideEmpty: boolean = false;

  constructor(protected advanceSearch: AdvanceSearch, protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, queryParamsService);
  }

}
