import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router, Params, NavigationEnd } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { BehaviorSubject, Subscription, Subject, Observable, of as observableOf, zip } from 'rxjs';
import { filter, debounceTime, distinctUntilChanged, switchMap, map, startWith, pairwise, concatMap } from 'rxjs/operators';
import { SearchResponse, NuxeoPageProviderParams, NuxeoRequestOptions, SearchFilterModel } from '@core/api';
import { GlobalSearchFormService, GlobalSearchFormEvent } from './global-search-form.service';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { removeUselessObject, getPathPartOfUrl } from '@core/services/helpers';
import { GlobalSearchFormSettings } from './global-search-form.interface';

export class SearchParams {
  readonly metadata: any = {};
  readonly override: any = {};
  readonly params: any = {};
  readonly event: string;
  constructor(params: any = {}, event: string, metadata: any = {}, override: any = {}) {
    this.metadata = metadata;
    this.override = override;
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

  protected subscription: Subscription = new Subscription();

  protected searchEvent$: Subject<SearchParams> = new Subject<SearchParams>();

  protected searchParams$: Subject<any> = new Subject<any>();

  protected inputSearchParams: any = {}; // for input

  protected defaultSearchParams: any = { // for form
    currentPageIndex: 0,
    pageSize: 20,
    ecm_fulltext: '',
  };

  protected allowedLinkParams: string[] = [
    'app_global_networkshare',
  ];

  @Input() filters: SearchFilterModel[] = [];

  @Input() beforeSearch: Function = (searchParams: NuxeoPageProviderParams, opts: NuxeoRequestOptions): { searchParams: NuxeoPageProviderParams, opts: NuxeoRequestOptions } => ({ searchParams, opts });

  @Input()
  set settings(settings: GlobalSearchFormSettings) {
    if (settings) {
      this.formSettings = settings;
    }
  }

  @Input()
  set searchParams(params: any) {
    if (params) {
      this.searchParams$.next(params);
    }
  }

  @Output() onSearch = new EventEmitter<SearchResponse>();

  constructor(
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected queryParamsService: SearchQueryParamsService,
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
    return this.filters && this.filters.length > 0;
  }

  protected onInit(): void {
    this.buildSearchForm();
    this.onSearchPerformed();
    this.onSearchTriggered();
    this.onCurrentPageChanged();
    this.subscribeServiceEvent();
  }

  protected buildSearchForm(): void {
    const controls = Object.assign({ aggregates: {} }, this.defaultSearchParams);
    this.searchForm = this.formBuilder.group(controls);
  }

  protected addControlToSearchForm(key: string, value: any): void {
    this.searchForm && this.searchForm.addControl(key, new FormControl(value));
  }

  protected getSearchQueryParams(): any {
    return this.formSettings.enableQueryParams ? this.convertToFormValues(this.queryParamsService.getSnapshotQueryParams()) : {};
  }
  // convert query params to form values
  protected convertToFormValues(queryParams: any = {}): any {
    const params = { aggregates: {}, ecm_fulltext: queryParams.q || '' };
    const keys = Object.keys(queryParams);
    for (const key of keys) {
      if (key.includes('_agg')) {
        params.aggregates[key] = typeof queryParams[key] === 'string' ? [queryParams[key]] : queryParams[key];
      } else {
        params[key] = queryParams[key];
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

  protected getNewPageSize(params: any = {}): any {
    if (!isNaN(params.currentPageIndex)) {
      params.pageSize = parseInt(params.pageSize, 10) * (parseInt(params.currentPageIndex, 10) + 1);
      params.currentPageIndex = 0;
    }
    return params;
  }

  protected onSearchParamsChanged(searchParams: any = {}, event: string, metadata: any = {}, override: any = {}): void {
    const queryValues = this.getSearchQueryParams();
    let params = Object.assign({}, this.getInputSearchParams(), this.getFormValue(), searchParams, queryValues);
    if (['onPageInitialized', 'onSearchParamsChanged'].includes(event)) {
      const pageSize = searchParams.pageSize;
      params = this.getNewPageSize(params);
      override['pageSize'] = pageSize;
    }
    this.triggerSearch(params, event, metadata, override);
  }

  protected onKeywordChanged(searchTerm: string): void {
    const params = Object.assign({}, this.getInputSearchParams(), this.getFormValue(), { ecm_fulltext: searchTerm });
    this.triggerSearch(params, 'onKeywordChanged');
  }

  protected onFilterChanged(aggregateModel: any = {}): void {
    const params = Object.assign({}, this.getInputSearchParams(), this.getFormValue(), { aggregates: aggregateModel });
    this.triggerSearch(params, 'onFilterChanged');
  }

  protected onSearchPerformed(): void {
    const subscription = this.searchEvent$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter((params: SearchParams) => params.params && Object.keys(params.params).length > 0),
      switchMap((params: SearchParams) => this.performSearch(params)),
    ).subscribe();
    this.subscription.add(subscription);
  }
  // set params to form
  protected setDefaultSearchParams(params: any = {}): void {
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
    if (params && Object.keys(params).length > 0) {
      this.inputSearchParams = { ...this.defaultSearchParams, ...params };
    }
  }

  protected getInputSearchParams(): any {
    return this.inputSearchParams;
  }

  protected buildQueryParams(): any {
    return this.queryParamsService.buildQueryParams(this.getFormValue(), ['q', 'aggregates', 'currentPageIndex'].concat(this.allowedLinkParams));
  }

  protected changeQueryParams(searchParams: any = {}): void {
    if (this.formSettings.enableQueryParams) {
      const queryParams = Object.assign({}, this.buildQueryParams(), searchParams);
      this.queryParamsService.changeQueryParams(queryParams);
    }
  }

  protected performFilterButton(event: string, params: NuxeoPageProviderParams): void {
    if (['onPageInitialized', 'onSearchParamsChanged'].includes(event)) {
      this.showFilter = params.hasFilters();
    }
  }

  protected onInitialCurrentPage(): Observable<boolean> {
    return this.router.events.pipe(
      startWith(null),
      filter(event => event === null || event instanceof NavigationEnd),
      pairwise(),
      map(([prev, current]: [NavigationEnd, NavigationEnd]) => this.isPageChanged(prev, current)),
      filter((res: boolean) => res),
    );
  }

  private isPageChanged(prev: NavigationEnd, current: NavigationEnd): boolean {
    return !prev || getPathPartOfUrl(prev.url) !== getPathPartOfUrl(current.url);
  }

  protected onCurrentPageChanged(): void {
    const subscription = zip(
      this.searchParams$,
      this.queryParamsService.onQueryParamsChanged(),
      this.onInitialCurrentPage(),
    ).pipe(
    ).subscribe(([searchParams, queryParams, _]: [any, any, boolean]) => {
      this.setInputSearchParams(searchParams);
      this.setDefaultSearchParams(queryParams);
      this.onSearchParamsChanged(searchParams, 'onPageInitialized');
      console.log(333333, searchParams);
    });
    this.subscription.add(subscription);
  }

  protected subscribeServiceEvent(): void {
    const subscription = this.globalSearchFormService.onEvent().subscribe((event: GlobalSearchFormEvent) => {
      switch (event.name) {
        case 'onSearch':
        case 'onPageNumberChanged':
          console.log(9999, event);
          this.onSearchParamsChanged(event.searchParams, event.name, event.metadata);
          break;
        default:
          break;
      }
    });
    this.subscription.add(subscription);
  }

  protected performSearch(params: SearchParams): Observable<SearchResponse> {
    const formValue = { ...params.params, ... { currentPageIndex: 0 }, ...params.override };
    switch (params.event) {
      case 'onPageInitialized':
        this.patchFormValue(formValue); // should update form params
        break;
      case 'onSearch':
      case 'onFilterChanged':
      case 'onKeywordChanged':
      case 'onPageNumberChanged':
      case 'onSearchParamsChanged':
        this.changeQueryParams(); // should update query params
        break;
      default:
        break;
    }
    const searchParams = removeUselessObject(params.params, ['q', 'id', 'folder']);
    params.metadata['event'] = params.event;
    params.metadata['source'] = this.formSettings.source;
    return this.search(searchParams, params.metadata);
  }

  protected search(queryParams: any = {}, metadata: any = {}): Observable<SearchResponse> {
    const params = new NuxeoPageProviderParams(this.queryParamsService.buildSearchParams(queryParams));
    const options = new NuxeoRequestOptions({ skipAggregates: false });
    const { searchParams, opts } = this.beforeSearch.call(this, params, options);
    return this.globalSearchFormService.advanceSearch(this.formSettings.pageProvider, searchParams, opts, metadata);
  }

  protected triggerSearch(searchParams: any = {}, event: string, metadata: any = {}, override: any = {}): void {
    this.searchEvent$.next(new SearchParams(searchParams, event, metadata, override));
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
