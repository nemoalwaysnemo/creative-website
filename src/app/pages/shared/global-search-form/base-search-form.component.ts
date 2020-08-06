import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router, Params, NavigationEnd } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { getPathPartOfUrl, objHasValue, convertToBoolean } from '@core/services/helpers';
import { BehaviorSubject, Subscription, Subject, Observable, of as observableOf, zip } from 'rxjs';
import { filter, debounceTime, switchMap, map, startWith, pairwise, concatMap } from 'rxjs/operators';
import { SearchResponse, GlobalSearchParams, NuxeoRequestOptions, SearchFilterModel, NuxeoQueryParams } from '@core/api';
import { GlobalSearchFormService, GlobalSearchFormEvent } from './global-search-form.service';
import { GlobalSearchFormSettings } from './global-search-form.interface';
import { DocumentPageService } from '../services/document-page.service';

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

  protected searchEvent$: Subject<GlobalSearchParams> = new Subject<GlobalSearchParams>();

  protected searchParams$: Subject<any> = new Subject<any>();

  protected inputParams: GlobalSearchParams; // for input

  protected formParams: any = { // for form
    ecm_fulltext: '',
    aggregates: {},
  };

  protected allowedLinkParams: string[] = [
    'app_global_networkshare',
  ];

  protected allowedSettingsParams: any = {
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

  @Input() beforeSearch: Function = (searchParams: GlobalSearchParams, opts: NuxeoRequestOptions): { searchParams: GlobalSearchParams, opts: NuxeoRequestOptions } => ({ searchParams, opts });

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
    this.searchForm = this.formBuilder.group(this.formParams);
  }

  protected addControlToSearchForm(key: string, value: any): void {
    this.searchForm && this.searchForm.addControl(key, new FormControl(value));
  }

  protected getFormSettings(key: string): any {
    return this.formSettings[key];
  }

  protected getSearchQueryParams(event: string, searchParams: GlobalSearchParams, queryParams: Params): any {
    if (this.enableQueryParams(searchParams) && ['onSearchParamsInitialized', 'onQueryParamsChanged'].includes(event)) {
      return new NuxeoQueryParams(queryParams).toSearchParams();
    }
    return {};
  }

  protected enableQueryParams(searchParams: GlobalSearchParams): boolean {
    return (searchParams.getSettings('enableQueryParams') || (this.getFormSettings('enableQueryParams') && searchParams.getSettings('enableQueryParams') === undefined));
  }

  protected enableSyncFormValue(searchParams: GlobalSearchParams): boolean {
    return (searchParams.getSettings('syncFormValue') || (this.getFormSettings('syncFormValue') && searchParams.getSettings('syncFormValue') === undefined));
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
    if (objHasValue(params)) {
      for (const key in params) {
        if (params.hasOwnProperty(key) && this.allowedLinkParams.includes(key)) {
          this.addControlToSearchForm(key, params[key]);
        }
      }
    }
  }

  protected setSettingsParams(params: any = {}): void {
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
  protected setInputParams(params: GlobalSearchParams): void {
    if (objHasValue(params) && !objHasValue(this.inputParams)) {
      this.inputParams = params;
    }
  }

  protected getInputParams(): GlobalSearchParams {
    return this.inputParams || new GlobalSearchParams();
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
        inputParams: searchParams instanceof GlobalSearchParams ? searchParams : new GlobalSearchParams(searchParams),
        queryParams: this.documentPageService.getSnapshotQueryParams(),
      })),
    ).subscribe(({ inputParams, queryParams }: any) => {
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
      this.setFormParams(queryParams);
      this.setSettingsParams(queryParams);
      this.onSearchParamsChanged('onQueryParamsChanged', new GlobalSearchParams(), queryParams);
    });
    this.subscription.add(subscription);
  }

  protected subscribeServiceEvent(): void {
    const subscription = this.globalSearchFormService.onEvent().subscribe((event: GlobalSearchFormEvent) => {
      switch (event.name) {
        case 'onPageNumberChanged':
        case 'onSearchParamsChanged':
          if (event.searchParams) {
            const searchParams = new GlobalSearchParams(Object.assign({}, this.getInputParams().providerParams, this.getFormValue(), event.searchParams), event.settings || {});
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
    const queryValues = this.getSearchQueryParams(event, searchParams, queryParams);
    const providerParams = new GlobalSearchParams(Object.assign({}, this.getInputParams().providerParams, this.getFormValue(), searchParams.providerParams, queryValues), searchParams.getSettings());
    this.triggerSearch(providerParams, event);
  }

  protected onKeywordChanged(searchTerm: string): void {
    const providerParams = new GlobalSearchParams(Object.assign({}, this.getInputParams().providerParams, this.getFormValue(), { ecm_fulltext: searchTerm, currentPageIndex: 0 }), this.getInputParams().getSettings());
    this.triggerSearch(providerParams, 'onKeywordChanged');
  }

  protected onFilterChanged(aggregateModel: any = {}): void {
    const providerParams = new GlobalSearchParams(Object.assign({}, this.getInputParams().providerParams, this.getFormValue(), { aggregates: aggregateModel, currentPageIndex: 0 }), this.getInputParams().getSettings());
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
          this.patchFormValue(searchParams.providerParams); // should update form params for changing input value
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
    const options = new NuxeoRequestOptions().setOptions('schemas', this.getFormSettings('schemas')).setOptions('skipAggregates', this.getFormSettings('skipAggregates'));
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
      this.triggerLoading(false, searchParams);
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
    if (typeof searchParams.getSettings('enableLoading') === 'undefined' || searchParams.getSettings('enableLoading')) {
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
