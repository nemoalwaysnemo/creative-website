import { Injectable } from '@angular/core';
import { filterParams, selectObjectByKeys } from '@core/services';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable()
export class SearchQueryParamsService {

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {

  }

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
      Object.keys(values.aggregates).forEach((key) => { values[key] = `["${values.aggregates[key].join('", "')}"]`; });
      delete values.aggregates;
    }
    return values;
  }

  changeQueryParams(commands: any[] = [], queryParams: any = {}, queryParamsHandling: 'merge' | 'preserve' | '' = ''): void {
    this.router.navigate(commands, { relativeTo: this.activatedRoute, queryParams, queryParamsHandling });
  }

  onQueryParamsChanged(): Observable<any> {
    return this.activatedRoute.queryParams.pipe(distinctUntilChanged());
  }

  getCurrentQueryParams(): any {
    return this.activatedRoute.snapshot.queryParams;
  }

}
