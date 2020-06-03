import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router, Params, NavigationEnd } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { BehaviorSubject, Subscription, Subject, Observable, of as observableOf, zip, timer } from 'rxjs';
import { filter, debounceTime, distinctUntilChanged, switchMap, map, startWith, pairwise, concatMap, tap, takeWhile } from 'rxjs/operators';
import { SearchResponse, NuxeoPageProviderParams, NuxeoRequestOptions, SearchFilterModel } from '@core/api';
import { GlobalSearchFormService, GlobalSearchFormEvent } from './global-search-form.service';
import { DocumentPageService } from '../services/document-page.service';
import { removeUselessObject, getPathPartOfUrl, objHasValue, selectObjectByKeys, filterParams } from '@core/services/helpers';
import { GlobalSearchFormSettings } from './global-search-form.interface';

export class SearchParams {
  readonly metadata: any = {};
  readonly params: any = {};
  readonly event: string;
  constructor(params: any = {}, event: string, metadata: any = {}) {
    this.metadata = metadata;
    this.params = params;
    this.event = event;
  }
}

@Component({
  template: '',
})
export class BaseSearchFormComponent implements OnInit, OnDestroy {

  searchForm: FormGroup;

  submitted: boolean = false;

  showFilter: boolean = false;

  hasAggs: boolean = false;

  loading: boolean = false;

  formSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings();

  searchResponse$ = new BehaviorSubject<SearchResponse>(null);

  protected enableQueryParamsChange: boolean = true;

  protected pageInitialized: boolean = false;

  protected subscription: Subscription = new Subscription();

  protected searchEvent$: Subject<SearchParams> = new Subject<SearchParams>();

  protected searchParams$: Subject<any> = new Subject<any>();

  protected inputSearchParams: any = {}; // for input

  protected defaultFormParams: any = { // for form
    currentPageIndex: 0,
    pageSize: 20,
    ecm_fulltext: '',
    aggregates: {},
  };

  protected allowedLinkParams: string[] = [
    'app_global_networkshare',
  ];

  @Input() filters: SearchFilterModel[] = [];

  @Input() beforeSearch: Function = (searchParams: NuxeoPageProviderParams, opts: NuxeoRequestOptions): { searchParams: NuxeoPageProviderParams, opts: NuxeoRequestOptions } => ({ searchParams, opts });

  @Input()
  set settings(settings: GlobalSearchFormSettings) {
    if (objHasValue(settings)) {
      this.formSettings = settings;
    }
  }

  @Input()
  set searchParams(params: any) {
    console.log(33, params);

    if (objHasValue(params)) {
      this.searchParams$.next(params);
    }
  }

  @Output() onSearch = new EventEmitter<SearchResponse>();

  constructor(
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected documentPageService: DocumentPageService,
    protected globalSearchFormService: GlobalSearchFormService,
  ) {
    this.onInit();
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onKeyup(event: any): void {
    this.onKeywordChanged(event.target.value.trim());
  }

  onFilterSelected(aggregateModel: any): void {
    this.onFilterChanged(aggregateModel);
  }

  toggleFilter(): void {
    if (!this.submitted) {
      this.showFilter = !this.showFilter;
    }
  }

  hasFilters(): boolean {
    return objHasValue(this.filters);
  }

  protected onInit(): void {
    this.buildSearchForm();
    this.onSearchPerformed();
    this.onSearchTriggered();
    this.onInputParamsChanged();
    this.onQueryParamsChanged();
    this.subscribeServiceEvent();
  }

  protected buildSearchForm(): void {
    this.searchForm = this.formBuilder.group(this.defaultFormParams);
  }

  protected addControlToSearchForm(key: string, value: any): void {
    this.searchForm && this.searchForm.addControl(key, new FormControl(value));
  }

  protected getSearchQueryParams(queryParams: Params): any {
    return this.formSettings.enableQueryParams ? this.convertToFormValues(queryParams) : {};
  }
  // convert query params to form values
  protected convertToFormValues(queryParams: Params = {}): any {
    const params = {};
    const keys = Object.keys(queryParams);
    if (keys.length > 0) {
      if (queryParams['ecm_fulltext'] || queryParams['q']) {
        params['ecm_fulltext'] = queryParams['ecm_fulltext'] || queryParams['q'];
      }
      params['aggregates'] = {};
      for (const key of keys) {
        if (key.includes('_agg')) {
          params['aggregates'][key] = typeof queryParams[key] === 'string' ? [queryParams[key]] : queryParams[key];
        } else {
          params[key] = queryParams[key];
        }
      }
    }
    return params;
  }

  protected patchFormValue(params: { [key: string]: any }): void {
    this.searchForm.patchValue(params);
  }

  protected getFormValue(): any {
    return this.searchForm.getRawValue();
  }

  protected onSearchParamsChanged(searchParams: any = {}, queryParams: Params = {}, event: string, metadata: any = {}): void {
    const queryValues = this.getSearchQueryParams(queryParams);
    const params = Object.assign({}, this.getInputSearchParams(), this.getFormValue(), searchParams, queryValues);
    this.triggerSearch(params, event, metadata);
  }

  protected onKeywordChanged(searchTerm: string): void {
    const params = Object.assign({}, this.getInputSearchParams(), this.getFormValue(), { ecm_fulltext: searchTerm, currentPageIndex: 0 });
    this.triggerSearch(params, 'onKeywordChanged');
  }

  protected onFilterChanged(aggregateModel: any = {}): void {
    const params = Object.assign({}, this.getInputSearchParams(), this.getFormValue(), { aggregates: aggregateModel, currentPageIndex: 0 });
    this.triggerSearch(params, 'onFilterChanged');
  }

  protected onSearchPerformed(): void {
    const subscription = this.searchEvent$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((params: SearchParams) => this.performSearch(params)),
    ).subscribe();
    this.subscription.add(subscription);
  }
  // set params to form
  protected setDefaultFormParams(params: any = {}): void {
    if (params && Object.keys(params).length > 0) {
      for (const key in params) {
        if (params.hasOwnProperty(key) && this.allowedLinkParams.includes(key)) {
          this.addControlToSearchForm(key, params[key]);
        }
      }
    }
  }
  // cache params
  protected setInputSearchParams(params: any = {}): void {
    if (params) {
      this.inputSearchParams = params;
    }
  }

  protected getInputSearchParams(): any {
    return this.inputSearchParams;
  }

  protected buildQueryParams(): any {
    return this.buildQueryParamsValue(this.getFormValue(), ['q', 'aggregates', 'currentPageIndex'].concat(this.allowedLinkParams));
  }

  protected buildQueryParamsValue(formValue: any = {}, allowedParams: string[] = []): any {
    formValue.q = formValue.ecm_fulltext ? formValue.ecm_fulltext : '';
    formValue = selectObjectByKeys(formValue, allowedParams);
    if (formValue.aggregates) {
      Object.keys(formValue.aggregates).forEach((key) => { formValue[key] = formValue.aggregates[key]; });
      delete formValue.aggregates;
    }
    return filterParams(formValue);
  }

  protected buildSearchParamsValue(formValue: any = {}): any {
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

  protected changeQueryParams(): void {
    if (this.formSettings.enableQueryParams) {
      this.enableQueryParamsChange = false;
      this.documentPageService.changeQueryParams(this.buildQueryParams()).subscribe(_ => {
        this.enableQueryParamsChange = true;
      });
    }
  }

  protected performFilterButton(event: string, params: NuxeoPageProviderParams): void {
    if (['onSearchParamsInitialized', 'onSearchParamsChanged', 'onQueryParamsChanged'].includes(event)) {
      this.showFilter = params.hasFilters();
    }
  }

  protected onInitialCurrentPage(): Observable<boolean> {
    return this.router.events.pipe(
      startWith(null),
      filter(event => event === null || event instanceof NavigationEnd),
      pairwise(),
      map(([prev, current]: [NavigationEnd, NavigationEnd]) => this.isPageChanged(prev, current)),
    );
  }

  private isPageChanged(prev: NavigationEnd, current: NavigationEnd): boolean {
    return !prev || getPathPartOfUrl(prev.url) !== getPathPartOfUrl(current.url);
  }

  protected onInputParamsChanged(): void {
    const subscription = this.searchParams$.pipe(
      map((searchParams: any) => ({ searchParams, queryParams: this.documentPageService.getSnapshotQueryParams() })),
    ).subscribe((data: any) => {
      this.setInputSearchParams(data.searchParams);
      this.setDefaultFormParams(data.queryParams);
      this.onSearchParamsChanged(data.searchParams, data.queryParams, 'onSearchParamsInitialized');
    });
    this.subscription.add(subscription);
  }

  protected onQueryParamsChanged(): void {
    const subscription = zip(
      this.onInitialCurrentPage(),
      this.documentPageService.onQueryParamsChanged(),
    ).pipe(
      filter((list: any[]) => this.formSettings.enableQueryParams && this.enableQueryParamsChange && !list[0]),
    ).subscribe(([_, queryParams]: [boolean, Params]) => {
      this.setDefaultFormParams(queryParams);
      this.onSearchParamsChanged({}, queryParams, 'onQueryParamsChanged');
    });
    this.subscription.add(subscription);
  }

  protected subscribeServiceEvent(): void {
    const subscription = this.globalSearchFormService.onEvent().subscribe((event: GlobalSearchFormEvent) => {
      switch (event.name) {
        case 'onPageNumberChanged':
        case 'onSearchParamsChanged':
          this.onSearchParamsChanged(event.searchParams, {}, event.name, event.metadata);
          break;
        default:
          break;
      }
    });
    this.subscription.add(subscription);
  }

  protected performSearch(params: SearchParams): Observable<SearchResponse> {
    switch (params.event) {
      case 'onFilterChanged':
      case 'onQueryParamsChanged':
      case 'onSearchParamsChanged':
      case 'onPageNumberChanged':
      case 'onSearchParamsInitialized':
        this.patchFormValue(params.params); // should update form params for changing input value
        break;
      default:
        break;
    }
    switch (params.event) {
      case 'onFilterChanged':
      case 'onKeywordChanged':
      case 'onSearchParamsChanged':
      case 'onPageNumberChanged':
        this.changeQueryParams(); // should update form params for changing input value
        break;
      default:
        break;
    }
    const searchParams = removeUselessObject(params.params, ['q', 'id', 'folder']);
    params.metadata['event'] = params.event;
    params.metadata['source'] = this.formSettings.source;
    params.metadata['searchParams'] = this.buildQueryParams();
    return this.search(searchParams, params.metadata);
  }

  protected search(queryParams: any = {}, metadata: any = {}): Observable<SearchResponse> {
    const params = new NuxeoPageProviderParams(this.buildSearchParamsValue(queryParams));
    const options = new NuxeoRequestOptions({ skipAggregates: false });
    const { searchParams, opts } = this.beforeSearch.call(this, params, options);
    return this.globalSearchFormService.advanceSearch(this.formSettings.pageProvider, searchParams, opts, metadata);
  }

  protected triggerSearch(searchParams: any = {}, event: string, metadata: any = {}): void {
    this.searchEvent$.next(new SearchParams(searchParams, event, metadata));
  }

  protected onSearchTriggered(): void {
    this.onBeforeSearch();
    this.onAfterSearch();
  }

  protected onBeforeSearch(): void {
    const subscription = this.globalSearchFormService.onSearch().pipe(
      filter((res: SearchResponse) => res.action === 'beforeSearch'),
    ).subscribe((res: SearchResponse) => {
      this.submitted = true;
      this.loading = true;
      this.onSearch.emit(res);
    });
    this.subscription.add(subscription);
  }

  protected onAfterSearch(): void {
    const subscription = this.globalSearchFormService.onSearch().pipe(
      filter(({ action }) => action === 'afterSearch'),
      concatMap((res: SearchResponse) => this.buildSearchFilter(res)),
      concatMap((res: SearchResponse) => this.onAfterSearchEvent(res)),
    ).subscribe(({ searchParams, metadata }) => {
      this.performFilterButton(metadata.event, searchParams);
      this.submitted = false;
      this.loading = false;
      this.hasAggs = true;
    });
    this.subscription.add(subscription);
  }

  protected onAfterSearchEvent(res: SearchResponse): Observable<SearchResponse> {
    return observableOf(res);
  }

  protected buildSearchFilter(res: SearchResponse): Observable<SearchResponse> {
    this.searchResponse$.next(res);
    return observableOf(res);
  }

}
