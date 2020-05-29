import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { filterParams, selectObjectByKeys } from '@core/services/helpers';
import { ActivatedRoute, Router, Params, NavigationExtras, ParamMap } from '@angular/router';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchQueryParamsService {

  constructor(
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
  ) { }

  buildQueryParams(formValue: any = {}, allowedParams: string[] = []): any {
    formValue.q = formValue.ecm_fulltext ? formValue.ecm_fulltext : '';
    formValue = selectObjectByKeys(formValue, allowedParams);
    if (formValue.aggregates) {
      Object.keys(formValue.aggregates).forEach((key) => { formValue[key] = formValue.aggregates[key]; });
      delete formValue.aggregates;
    }
    return filterParams(formValue);
  }

  buildSearchParams(formValue: any = {}): any {
    const values = filterParams(formValue, ['quickFilters', 'ecm_mixinType_not_in']);
    if (values.aggregates) {
      const keys = Object.keys(values.aggregates);
      if (keys.length > 0) {
        keys.filter((key) => values.aggregates[key].length > 0).forEach((key) => { values[key] = `["${values.aggregates[key].join('", "')}"]`; });
      }
      delete values.aggregates;
    }
    return values;
  }

  changeQueryParams(queryParams: any = {}, state: any = {}, queryParamsHandling: 'merge' | 'preserve' | '' = '', skipLocationChange: boolean = false): Observable<boolean> {
    return from(this.navigate([], { relativeTo: this.activatedRoute, queryParams, queryParamsHandling, skipLocationChange, state }));
  }

  clearQueryParams(): void {
    this.changeQueryParams({});
  }

  getSnapshotQueryParams(): Params {
    return this.activatedRoute.snapshot.queryParams;
  }

  getSnapshotQueryParamMap(): ParamMap {
    return this.activatedRoute.snapshot.queryParamMap;
  }

  onQueryParamsChanged(): Observable<Params> {
    return this.activatedRoute.queryParams;
  }

  navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
    return this.router.navigate(commands, extras);
  }

  redirect(link: string): Promise<boolean> {
    const url = decodeURI(link);
    return this.router.navigate(['/p/redirect'], { queryParams: { url }, skipLocationChange: true });
  }

  historyBack(): void {
    this.location.back();
  }

  redirectTo403(): void {
    this.router.navigate(['/p/error/403']);
  }

  redirectTo404(): void {
    this.router.navigate(['/p/error/404']);
  }

  refresh(): void {
    const queryParams = this.getSnapshotQueryParams();
    delete queryParams['currentPageIndex'];
    this.changeQueryParams(queryParams);
  }

  getCurrentUrl(): string {
    return this.router.url;
  }

}
