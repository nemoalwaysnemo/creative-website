import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router, Params, NavigationEnd } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { BehaviorSubject, Subscription, Subject, Observable, of as observableOf, zip } from 'rxjs';
import { filter, debounceTime, distinctUntilChanged, switchMap, map, startWith, pairwise, concatMap } from 'rxjs/operators';
import { removeUselessObject, getPathPartOfUrl, objHasValue, selectObjectByKeys, filterParams, convertToBoolean } from '@core/services/helpers';
import { SearchResponse, NuxeoPageProviderParams, NuxeoRequestOptions, SearchFilterModel } from '@core/api';
import { GlobalSearchFormService, GlobalSearchFormEvent } from './global-search-form.service';
import { DocumentPageService } from '../services/document-page.service';
import { GlobalSearchFormSettings } from './global-search-form.interface';

export class SearchParams {
  readonly metadata: any = {};
  readonly params: NuxeoPageProviderParams;
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

  protected allowedSettingsParams: {} = {
    'showFilter': convertToBoolean,
  };

  @Input() filters: SearchFilterModel[] = [];

  @Input()
  set settings(settings: GlobalSearchFormSettings) {
    if (objHasValue(settings)) {
      this.formSettings = settings;
    }
  }

  @Input()
  set searchParams(params: any) {
    if (objHasValue(params)) {
      this.searchParams$.next(params);
    }
  }

  @Input() beforeSearch: Function = (searchParams: NuxeoPageProviderParams, opts: NuxeoRequestOptions, metadata: any = {}): { searchParams: NuxeoPageProviderParams, opts: NuxeoRequestOptions } => ({ searchParams, opts });

  @Input() afterSearch: Function = (res: SearchResponse): Observable<SearchResponse> => observableOf(res);

  @Output() onResponse: EventEmitter<SearchResponse> = new EventEmitter<SearchResponse>();

  constructor(
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected documentPageService: DocumentPageService,
    protected globalSearchFormService: GlobalSearchFormService,
  ) {
    this.subscribeEvents();
  }

  ngOnInit(): void {
    this.onInit();
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

  }

  protected subscribeEvents(): void {
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

  protected getFormSettings(key: string): any {
    return this.formSettings[key];
  }

  protected getSearchQueryParams(queryParams: Params): any {
    return this.getFormSettings('enableQueryParams') ? this.convertToFormValues(queryParams) : {};
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

  protected onSearchParamsChanged(searchParams: NuxeoPageProviderParams, queryParams: Params = {}, event: string, metadata: any = {}): void {
    const queryValues = searchParams.hasKeyword() ? {} : this.getSearchQueryParams(queryParams);
    const providerParams = new NuxeoPageProviderParams(Object.assign({}, this.getInputSearchParams().toParams(), this.getFormValue(), searchParams.toParams(), queryValues));
    providerParams.setSettings(searchParams.hasSettings() ? searchParams.getSettings() : this.getInputSearchParams().getSettings());
    this.triggerSearch(providerParams, event, metadata);
  }

  protected onKeywordChanged(searchTerm: string): void {
    const providerParams = new NuxeoPageProviderParams(Object.assign({}, this.getInputSearchParams().toParams(), this.getFormValue(), { ecm_fulltext: searchTerm, currentPageIndex: 0 }));
    this.triggerSearch(providerParams, 'onKeywordChanged');
  }

  protected onFilterChanged(aggregateModel: any = {}): void {
    const providerParams = new NuxeoPageProviderParams(Object.assign({}, this.getInputSearchParams().toParams(), this.getFormValue(), { aggregates: aggregateModel, currentPageIndex: 0 }));
    this.triggerSearch(providerParams, 'onFilterChanged');
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
    if (objHasValue(params)) {
      for (const key in params) {
        if (params.hasOwnProperty(key) && this.allowedLinkParams.includes(key)) {
          this.addControlToSearchForm(key, params[key]);
        }
      }
    }
  }

  protected performSettingsParams(params: any = {}): void {
    if (objHasValue(params)) {
      for (const key in params) {
        const func = this.allowedSettingsParams[key];
        if (func && params.hasOwnProperty(key)) {
          this.formSettings[key] = func.call(this, params[key]);
        }
      }
    }
  }

  // cache params
  protected setInputSearchParams(params: NuxeoPageProviderParams): void {
    if (params) {
      this.inputSearchParams = params;
    }
  }

  protected getInputSearchParams(): NuxeoPageProviderParams {
    return this.inputSearchParams;
  }

  protected buildQueryParams(additionalParams: any = {}): any {
    return Object.assign(additionalParams, this.buildQueryParamsValue(this.getFormValue(), ['q', 'aggregates', 'currentPageIndex'].concat(this.allowedLinkParams)));
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
    this.enableQueryParamsChange = false;
    this.documentPageService.changeQueryParams(this.buildQueryParams()).subscribe(_ => {
      this.enableQueryParamsChange = true;
    });
  }

  protected performFilterButton(event: string, searchParams: NuxeoPageProviderParams): void {
    if (this.getFormSettings('showFilter') || searchParams.getSettings('showFilter')) {
      this.showFilter = true;
    } else if (['onSearchParamsInitialized', 'onSearchParamsChanged', 'onQueryParamsChanged'].includes(event)) {
      this.showFilter = searchParams.hasFilters();
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
      map((searchParams: any) => ({
        inputParams: searchParams instanceof NuxeoPageProviderParams ? searchParams : new NuxeoPageProviderParams(searchParams),
        queryParams: this.documentPageService.getSnapshotQueryParams(),
      })),
    ).subscribe(({ inputParams, queryParams }: any) => {
      this.setInputSearchParams(inputParams);
      this.setDefaultFormParams(queryParams);
      this.performSettingsParams(queryParams);
      this.onSearchParamsChanged(inputParams, queryParams, 'onSearchParamsInitialized');
    });
    this.subscription.add(subscription);
  }

  protected onQueryParamsChanged(): void {
    const subscription = zip(
      this.onInitialCurrentPage(),
      this.documentPageService.onQueryParamsChanged(),
    ).pipe(
      filter((list: any[]) => this.getFormSettings('enableQueryParams') && this.enableQueryParamsChange && !list[0]),
    ).subscribe(([_, queryParams]: [boolean, Params]) => {
      this.setDefaultFormParams(queryParams);
      this.performSettingsParams(queryParams);
      this.onSearchParamsChanged(new NuxeoPageProviderParams(), queryParams, 'onQueryParamsChanged');
    });
    this.subscription.add(subscription);
  }

  protected subscribeServiceEvent(): void {
    const subscription = this.globalSearchFormService.onEvent().subscribe((event: GlobalSearchFormEvent) => {
      switch (event.name) {
        case 'onPageNumberChanged':
        case 'onSearchParamsChanged':
          if (event.searchParams) {
            this.onSearchParamsChanged(event.searchParams, {}, event.name, event.metadata);
          }
          break;
        default:
          break;
      }
    });
    this.subscription.add(subscription);
  }

  protected performSearch(searchParams: SearchParams): Observable<SearchResponse> {
    switch (searchParams.event) {
      case 'onFilterChanged':
      case 'onQueryParamsChanged':
      case 'onSearchParamsChanged':
      case 'onPageNumberChanged':
      case 'onSearchParamsInitialized':
        if (searchParams.params.getSettings('syncFormValue') || (this.getFormSettings('syncFormValue') && searchParams.params.getSettings('syncFormValue') === undefined)) {
          this.patchFormValue(searchParams.params); // should update form params for changing input value
        }
        break;
      default:
        break;
    }
    switch (searchParams.event) {
      case 'onFilterChanged':
      case 'onKeywordChanged':
      case 'onSearchParamsChanged':
      case 'onPageNumberChanged':
        if (this.getFormSettings('enableQueryParams')) {
          this.changeQueryParams(); // should update form params for changing input value
        }
        break;
      default:
        break;
    }
    this.patchFormValue({ currentPageIndex: 0, pageSize: this.getInputSearchParams().toParams().pageSize || this.defaultFormParams.pageSize });
    const func = (k: string, v: any): boolean => (['q', 'id', 'folder'].includes(k) || this.allowedSettingsParams[k]);
    const params = this.buildSearchParamsValue(removeUselessObject(searchParams.params, func));
    searchParams.metadata['event'] = searchParams.event;
    searchParams.metadata['source'] = this.getFormSettings('source');
    const providerParams = new NuxeoPageProviderParams(params).setSettings(searchParams.params.getSettings());
    const options = new NuxeoRequestOptions();
    options.setOptions('schemas', this.getFormSettings('schemas'));
    options.setOptions('skipAggregates', this.getFormSettings('skipAggregates'));
    return this.search(providerParams, options, searchParams.metadata);
  }

  protected search(params: NuxeoPageProviderParams, options: NuxeoRequestOptions, metadata: any = {}): Observable<SearchResponse> {
    const { searchParams, opts } = this.beforeSearch.call(this, params, options, metadata);
    const pageProvider = this.getFormSettings('pageProvider');
    metadata['searchParams'] = params.toQueryParams();
    searchParams.setSettings(params.getSettings());
    return this.globalSearchFormService.advanceSearch(pageProvider, searchParams, opts, metadata);
  }

  protected triggerSearch(searchParams: NuxeoPageProviderParams, event: string, metadata: any = {}): void {
    this.searchEvent$.next(new SearchParams(searchParams, event, metadata));
  }

  protected onSearchTriggered(): void {
    this.onBeforeSearch();
    this.onAfterSearch();
  }

  protected onBeforeSearch(): void {
    const subscription = this.globalSearchFormService.onSearch().pipe(
      filter((res: SearchResponse) => res.action === 'beforeSearch' && res.source === this.getFormSettings('source')),
    ).subscribe(({ searchParams, metadata }: any) => {
      this.performFilterButton(metadata.event, searchParams);
      this.triggerLoading(true, metadata);
      this.submitted = true;
    });
    this.subscription.add(subscription);
  }

  protected onAfterSearch(): void {
    const subscription = this.globalSearchFormService.onSearch().pipe(
      filter((res: SearchResponse) => res.action === 'afterSearch' && res.source === this.getFormSettings('source')),
      concatMap((res: SearchResponse) => this.buildSearchFilter(res)),
      concatMap((res: SearchResponse) => this.afterSearch(res)),
      concatMap((res: SearchResponse) => this.onAfterSearchEvent(res)),
    ).subscribe((res: SearchResponse) => {
      this.onResponse.emit(res);
      this.triggerLoading(false, res.metadata);
      this.hasAggs = res.response.hasAgg();
      this.submitted = false;
    });
    this.subscription.add(subscription);
  }

  protected triggerLoading(loading: boolean, metadata: any = {}): void {
    if (typeof metadata.enableLoading === 'undefined' || metadata.enableLoading) {
      this.loading = loading;
    }
  }

  protected onAfterSearchEvent(res: SearchResponse): Observable<SearchResponse> {
    return observableOf(res);
  }

  protected buildSearchFilter(res: SearchResponse): Observable<SearchResponse> {
    this.searchResponse$.next(res);
    return observableOf(res);
  }

}
