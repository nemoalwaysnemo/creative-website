import { Injectable } from '@angular/core';
import { filterParams, selectObjectByKeys } from '@core/services';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class SearchQueryParamsService {

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  buildQueryParams(formValue: any = {}): any {
    formValue.q = formValue.ecm_fulltext ? formValue.ecm_fulltext : '';
    formValue = selectObjectByKeys(formValue, ['q', 'aggregates']);
    if (formValue.aggregates) {
      Object.keys(formValue.aggregates).forEach((key) => { formValue[key] = formValue.aggregates[key]; });
      delete formValue.aggregates;
    }
    return filterParams(formValue);
  }

  buildSearchParams(formValue: any = {}): any {
    const values = filterParams(formValue);
    if (values.aggregates) {
      const keys = Object.keys(values.aggregates);
      if (keys.length > 0) {
        keys.filter((key) => values.aggregates[key].length > 0).forEach((key) => { values[key] = `["${values.aggregates[key].join('", "')}"]`; });
      }
      delete values.aggregates;
    }
    return values;
  }

  changeQueryParams(queryParams: any = {}, state: any = {}, queryParamsHandling: 'merge' | 'preserve' | '' = ''): void {
    this.router.navigate([], { relativeTo: this.activatedRoute, queryParams, queryParamsHandling, state });
  }

  redirectTo404(): void {
    this.router.navigate(['/p/error/404']);
  }
}
