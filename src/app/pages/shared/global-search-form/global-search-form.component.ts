import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AdvanceSearch } from '@core/api';
import { GoogleAnalyticsService } from '@core/services';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { BaseSearchFormComponent } from './base-search-form.component';

@Component({
  selector: 'global-search-form',
  styleUrls: ['./global-search-form.component.scss'],
  templateUrl: './global-search-form.component.html',
})
export class GlobalSearchFormComponent extends BaseSearchFormComponent {

  constructor(
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected advanceSearch: AdvanceSearch,
    protected queryParamsService: SearchQueryParamsService,
    protected googleAnalyticsService: GoogleAnalyticsService,
  ) {
    super(
      router,
      formBuilder,
      advanceSearch,
      queryParamsService,
      googleAnalyticsService,
    );
  }

}
