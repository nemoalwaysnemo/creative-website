import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { BaseSearchFormComponent } from './base-search-form.component';
import { GlobalSearchFormService } from './global-search-form.service';

@Component({
  selector: 'global-search-form',
  styleUrls: ['./global-search-form.component.scss'],
  templateUrl: './global-search-form.component.html',
})
export class GlobalSearchFormComponent extends BaseSearchFormComponent {

  constructor(
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected queryParamsService: SearchQueryParamsService,
    protected globalSearchFormService: GlobalSearchFormService,
  ) {
    super(
      router,
      formBuilder,
      queryParamsService,
      globalSearchFormService,
    );
  }

}
