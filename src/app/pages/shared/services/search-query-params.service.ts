import { Injectable } from '@angular/core';
import { filterParams, selectObjectByKeys } from '@core/services';
import { ActivatedRoute, Router, Params, Event, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { distinctUntilChanged, share, filter, tap, map } from 'rxjs/operators';

export class PageChangedInfo {
  readonly queryParams: Params;
  readonly historyState: { [k: string]: any };
  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}

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

  onQueryParamsChanged(): Observable<Params> {
    return this.activatedRoute.queryParams.pipe(
      distinctUntilChanged(),
      share(),
    );
  }

  onPageChanged(): Observable<PageChangedInfo> {
    return this.router.events.pipe(
      filter((e: Event) => e instanceof NavigationEnd),
      map(_ => new PageChangedInfo({ queryParams: this.getCurrentQueryParams(), historyState: this.router.getCurrentNavigation().extras.state || {} })),
    );
  }

  getCurrentQueryParams(): Params {
    return this.activatedRoute.snapshot.queryParams;
  }

}
