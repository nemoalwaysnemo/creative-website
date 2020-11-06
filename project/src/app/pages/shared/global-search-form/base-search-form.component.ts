import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router, Params, NavigationEnd } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { getPathPartOfUrl, isValueEmpty, convertToBoolean } from '@core/services/helpers';
import { BehaviorSubject, Subscription, Subject, Observable, of as observableOf, zip, combineLatest } from 'rxjs';
import { filter, debounceTime, switchMap, map, startWith, pairwise, concatMap } from 'rxjs/operators';
import { SearchResponse, GlobalSearchParams, NuxeoRequestOptions, SearchFilterModel, NuxeoQueryParams } from '@core/api';
import { GlobalSearchFormService, GlobalSearchFormEvent } from './global-search-form.service';
import { GlobalSearchFormSettings, GlobalSearchSettings } from './global-search-form.interface';
import { DocumentPageService } from '../services/document-page.service';

@Component({
  template: '',
})
export class BaseSearchFormComponent implements OnInit, OnDestroy {

  @Input()
  set settings(settings: GlobalSearchFormSettings) {
    if (!isValueEmpty(settings)) {
      this.searchFormSettings$.next(settings);
    }
  }

  @Input()
  set searchParams(params: any) {
    if (!isValueEmpty(params)) {
      this.searchParams$.next(params);
    }
  }

  constructor(
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected documentPageService: DocumentPageService,
    protected globalSearchFormService: GlobalSearchFormService,
  ) {
    this.subscribeEvents();
  }

  searchForm: FormGroup;

  submitted: boolean = false;

  showFilter: boolean = false;

  hasAggs: boolean = false;

  loading: boolean = false;

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings();

  searchResponse$ = new BehaviorSubject<SearchResponse>(null);

  protected enableQueryParamsChange: boolean = true;

  protected pageInitialized: boolean = false;

  protected subscription: Subscription = new Subscription();

  protected searchEvent$: Subject<GlobalSearchParams> = new Subject<GlobalSearchParams>();

  protected searchParams$: Subject<any> = new Subject<any>();

  protected searchFormSettings$: Subject<GlobalSearchFormSettings> = new Subject<GlobalSearchFormSettings>();

  protected baseParams: GlobalSearchParams; // for input

  protected currentParams: GlobalSearchParams; // for input

  protected formParams: any = { // for form
    ecm_fulltext: '',
    aggregates: {},
  };

  protected allowedLinkParams: string[] = [
    'app_global_networkshare',
  ];

  protected allowedSettingsParams: any = {
    showFilter: convertToBoolean,
  };

  @Input() filters: SearchFilterModel[] = [];

  @Output() onResponse: EventEmitter<SearchResponse> = new EventEmitter<SearchResponse>();

  @Output() onLoading: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() beforeSearch: (searchParams: GlobalSearchParams, opts: NuxeoRequestOptions) => any =
    (searchParams: GlobalSearchParams, opts: NuxeoRequestOptions): { searchParams: GlobalSearchParams, opts: NuxeoRequestOptions } => ({ searchParams, opts })

  @Input() afterSearch: (res: SearchResponse) => any = (res: SearchResponse): Observable<SearchResponse> => observableOf(res);

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
    return !isValueEmpty(this.filters);
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
    this.searchForm = this.formBuilder.group(this.formParams);
  }

  protected addControlToSearchForm(key: string, value: any): void {
    this.searchForm && this.searchForm.addControl(key, new FormControl(value));
  }

  protected getFormSettings(key: string): any {
    return this.searchFormSettings[key];
  }

  protected setFormSettings(settings: GlobalSearchFormSettings): void {
    this.searchFormSettings = settings;
  }

  protected getSearchSettings(key: string, searchParams: GlobalSearchParams): any {
    return searchParams.getSettings(key) !== undefined ? searchParams.getSettings(key) : this.getFormSettings(key);
  }

  protected getSearchQueryParams(event: string, searchParams: GlobalSearchParams, queryParams: Params): NuxeoQueryParams {
    const params = this.enableQueryParams(searchParams) && ['onSearchParamsInitialized', 'onQueryParamsChanged'].includes(event) ? queryParams : {};
    return new NuxeoQueryParams(params);
  }

  protected enableQueryParams(searchParams: GlobalSearchParams): boolean {
    return this.checkSearchSettings('enableQueryParams', searchParams);
  }

  protected enableSyncFormValue(searchParams: GlobalSearchParams): boolean {
    return this.checkSearchSettings('syncFormValue', searchParams);
  }

  protected currentAsSearchParams(searchParams: GlobalSearchParams): boolean {
    return this.checkSearchSettings('currentAsSearchParams', searchParams);
  }

  protected checkSearchSettings(key: string, searchParams: GlobalSearchParams): boolean {
    return (searchParams.getSettings(key) || (this.getFormSettings(key) && searchParams.getSettings(key) === undefined));
  }

  protected getSearchParams(): GlobalSearchParams {
    return this.currentAsSearchParams(this.getCurrentParams()) ? this.getCurrentParams() : this.getBaseParams();
  }

  protected patchFormValue(params: { [key: string]: any }): void {
    this.searchForm.patchValue(params);
  }

  protected getFormValue(): any {
    return this.searchForm.getRawValue();
  }

  protected resetFormValue(): any {
    return this.searchForm.reset();
  }

  // set params to form
  protected setFormParams(params: any = {}): void {
    if (!isValueEmpty(params)) {
      for (const key in params) {
        if (params.hasOwnProperty(key) && this.allowedLinkParams.includes(key)) {
          this.addControlToSearchForm(key, params[key]);
        }
      }
    }
  }

  protected setSettingsParams(params: any = {}): void {
    if (!isValueEmpty(params)) {
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          const func = this.allowedSettingsParams[key];
          if (func) {
            this.searchFormSettings[key] = func.call(this, params[key]);
          }
        }
      }
    }
  }

  // cache params
  protected setInputParams(params: GlobalSearchParams): void {
    if (!isValueEmpty(params)) {
      if (isValueEmpty(this.baseParams)) {
        this.baseParams = params;
      }
      this.currentParams = params;
    }
  }

  protected getBaseParams(): GlobalSearchParams {
    return this.baseParams || new GlobalSearchParams();
  }

  protected getCurrentParams(): GlobalSearchParams {
    return this.currentParams || new GlobalSearchParams();
  }

  protected changeQueryParams(searchParams: GlobalSearchParams): void {
    this.enableQueryParamsChange = false;
    this.documentPageService.changeQueryParams(searchParams.toQueryParams()).subscribe(_ => {
      this.enableQueryParamsChange = true;
    });
  }

  protected performFilterButton(searchParams: GlobalSearchParams): void {
    if (this.getFormSettings('showFilter') || searchParams.getSettings('showFilter')) {
      this.showFilter = true;
    } else if (['onSearchParamsInitialized', 'onSearchParamsChanged', 'onQueryParamsChanged'].includes(searchParams.event)) {
      this.showFilter = searchParams.hasFilters();
    }
  }

  protected onInitialCurrentPage(): Observable<boolean> {
    return this.router.events.pipe(
      startWith(null as string),
      filter(event => event === null || event instanceof NavigationEnd),
      pairwise(),
      map(([prev, current]: [NavigationEnd, NavigationEnd]) => this.isPageChanged(prev, current)),
    );
  }

  private isPageChanged(prev: NavigationEnd, current: NavigationEnd): boolean {
    return !prev || getPathPartOfUrl(prev.url) !== getPathPartOfUrl(current.url);
  }

  protected onInputParamsChanged(): void {
    const subscription = combineLatest([
      this.searchFormSettings$,
      this.searchParams$,
    ]).pipe(
      map(([formSettings, searchParams]: [GlobalSearchSettings, any]) => ({
        formSettings,
        inputParams: searchParams instanceof GlobalSearchParams ? searchParams : new GlobalSearchParams(searchParams),
        queryParams: this.documentPageService.getSnapshotQueryParams(),
      })),
    ).subscribe(({ formSettings, inputParams, queryParams }: any) => {
      this.setFormSettings(formSettings);
      this.setInputParams(inputParams);
      this.setFormParams(queryParams);
      this.setSettingsParams(queryParams);
      this.onSearchParamsChanged('onSearchParamsInitialized', inputParams, queryParams);
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
      this.resetFormValue();
      this.setFormParams(queryParams);
      this.setSettingsParams(queryParams);
      this.onSearchParamsChanged('onQueryParamsChanged', this.getSearchParams(), queryParams);
    });
    this.subscription.add(subscription);
  }

  protected subscribeServiceEvent(): void {
    const subscription = this.globalSearchFormService.onEvent().subscribe((event: GlobalSearchFormEvent) => {
      switch (event.name) {
        case 'onPageNumberChanged':
        case 'onSearchParamsChanged':
          if (event.searchParams) {
            const searchParams = new GlobalSearchParams(Object.assign({}, this.getSearchParams().providerParams, this.getFormValue(), event.searchParams), event.settings || {});
            this.onSearchParamsChanged(event.name, searchParams);
          }
          break;
        default:
          break;
      }
    });
    this.subscription.add(subscription);
  }

  protected onSearchParamsChanged(event: string, searchParams: GlobalSearchParams, queryParams: Params = {}): void {
    const queryValues: NuxeoQueryParams = this.getSearchQueryParams(event, searchParams, queryParams);
    const providerParams = new GlobalSearchParams(Object.assign({}, this.getFormValue(), searchParams.providerParams), searchParams.getSettings()).setQueryParams(queryValues);
    this.triggerSearch(providerParams, event);
  }

  protected onKeywordChanged(searchTerm: string): void {
    const providerParams = new GlobalSearchParams(Object.assign({}, this.getSearchParams().providerParams, this.getFormValue(), { ecm_fulltext: searchTerm, currentPageIndex: 0 }), this.getSearchParams().getSettings());
    this.triggerSearch(providerParams, 'onKeywordChanged');
  }

  protected onFilterChanged(aggregateModel: any = {}): void {
    const providerParams = new GlobalSearchParams(Object.assign({}, this.getSearchParams().providerParams, this.getFormValue(), { aggregates: aggregateModel, currentPageIndex: 0 }), this.getSearchParams().getSettings());
    this.triggerSearch(providerParams, 'onFilterChanged');
  }

  protected onSearchPerformed(): void {
    const subscription = this.searchEvent$.pipe(
      debounceTime(500),
      switchMap((params: GlobalSearchParams) => this.performSearch(params)),
    ).subscribe();
    this.subscription.add(subscription);
  }

  protected performSearch(searchParams: GlobalSearchParams): Observable<SearchResponse> {
    switch (searchParams.event) {
      case 'onFilterChanged':
      case 'onQueryParamsChanged':
      case 'onSearchParamsChanged':
      case 'onPageNumberChanged':
      case 'onSearchParamsInitialized':
        if (this.enableSyncFormValue(searchParams)) {
          this.resetFormValue();
          this.patchFormValue(searchParams.toFormValues()); // should update form params for changing input value
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
          this.changeQueryParams(searchParams); // should update form params for changing input value
        }
        break;
      default:
        break;
    }
    const options = new NuxeoRequestOptions().setOptions('schemas', this.getSearchSettings('schemas', searchParams)).setOptions('skipAggregates', this.getSearchSettings('skipAggregates', searchParams));
    return this.search(searchParams, options);
  }

  protected search(requestParams: GlobalSearchParams, options: NuxeoRequestOptions): Observable<SearchResponse> {
    const { searchParams, opts } = this.beforeSearch(requestParams, options);
    searchParams.mergeSettings({ event: (searchParams.event || requestParams.event), source: (searchParams.source || requestParams.source) });
    return this.globalSearchFormService.advanceSearch(this.getFormSettings('pageProvider'), searchParams, opts);
  }

  protected triggerSearch(searchParams: GlobalSearchParams, event: string): void {
    searchParams.mergeSettings({ source: (searchParams.source || this.getFormSettings('source')), event });
    this.searchEvent$.next(searchParams);
  }

  protected onSearchTriggered(): void {
    this.onBeforeSearch();
    this.onAfterSearch();
  }

  protected onBeforeSearch(): void {
    const subscription = this.globalSearchFormService.onSearch().pipe(
      filter((res: SearchResponse) => res.action === 'beforeSearch' && res.source === this.getFormSettings('source')),
      concatMap((res: SearchResponse) => this.onBeforeSearchEvent(res)),
    ).subscribe(({ searchParams }: any) => {
      this.performFilterButton(searchParams);
      this.triggerLoading(true, searchParams);
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
      this.triggerLoading(false, res.searchParams);
      this.hasAggs = res.response.hasAgg();
      this.submitted = false;
    });
    this.subscription.add(subscription);
  }

  protected triggerLoading(loading: boolean, searchParams: GlobalSearchParams): void {
    if (this.checkSearchSettings('enableLoading', searchParams)) {
      this.onLoading.emit(loading);
      this.loading = loading;
    }
  }

  protected onBeforeSearchEvent(res: SearchResponse): Observable<SearchResponse> {
    return observableOf(res);
  }

  protected onAfterSearchEvent(res: SearchResponse): Observable<SearchResponse> {
    return observableOf(res);
  }

  protected buildSearchFilter(res: SearchResponse): Observable<SearchResponse> {
    this.searchResponse$.next(res);
    return observableOf(res);
  }

}
