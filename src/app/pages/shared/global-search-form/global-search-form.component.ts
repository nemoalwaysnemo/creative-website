import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { AdvanceSearch } from '@core/api';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { GoogleAnalyticsService } from '@core/google-analytics';
import { AbstractSearchFormComponent } from './abstract-search-form.component';

@Component({
  selector: 'global-search-form',
  styleUrls: ['./global-search-form.component.scss'],
  templateUrl: './global-search-form.component.html',
})
export class GlobalSearchFormComponent extends AbstractSearchFormComponent {

  @Input() showInput: boolean = true;

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

  isShowInput(): boolean {
    return this.showInput;
  }

}
