import { OnInit, OnDestroy, Input } from '@angular/core';
import { Router, Params, NavigationEnd } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { BehaviorSubject, Subscription, Subject, Observable } from 'rxjs';
import { filter, tap, debounceTime, distinctUntilChanged, switchMap, delay, map, startWith, pairwise, merge, skipUntil } from 'rxjs/operators';
import { AdvanceSearch, AggregateModel, filterAggregates, SearchResponse, NuxeoPageProviderParams, NuxeoRequestOptions, SearchFilterModel } from '@core/api';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { removeUselessObject, getPathPartOfUrl } from '@core/services';
import { GoogleAnalyticsService } from '@core/google-analytics';

export class PageChangedInfo {
  readonly initial: boolean;
  readonly queryParams: Params;
  readonly historyState: { [k: string]: any };
  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}

export class SearchParams {
  readonly defaults: { [k: string]: any } = {};
  readonly params: { [k: string]: any } = {};
  readonly event: string;
  constructor(params: any = {}, event: string, defaults?: any) {
    this.defaults = defaults || {};
    this.params = params;
    this.event = event;
  }
}

export abstract class AbstractSearchFormComponent implements OnInit, OnDestroy {

  searchForm: FormGroup;

  submitted: boolean = false;

  showFilter: boolean = false;

  hasAggs: boolean = false;

  aggregateModels$ = new BehaviorSubject<AggregateModel[]>([]);

  protected subscription: Subscription = new Subscription();

  protected search$: Subject<SearchParams> = new Subject();

  // protected pageChangedSearch: boolean = true;

  protected params: any = {
    currentPageIndex: 0,
    pageSize: 20,
    ecm_fulltext: '',
  };

  protected allowedLinkParams: string[] = [
    'app_global_networkshare',
  ];

  protected searchParams: any = {};

  @Input() showQuery: boolean = true;

  @Input() placeholder: string = 'Search for...';

  @Input() filters: SearchFilterModel[] = [];

  @Input() beforeSearch: Function = (searchParams: NuxeoPageProviderParams, opts: NuxeoRequestOptions): { searchParams: NuxeoPageProviderParams, opts: NuxeoRequestOptions } => ({ searchParams, opts });

  @Input()
  set defaultParams(params: any) {
    // this.pageChangedSearch = true;
    this.setSearchParams(params);
  }

  @Input()
  set baseParams(params: any) {
    // this.pageChangedSearch = false;
    if (params && Object.keys(params).length > 0) {
      this.setSearchParams(params);
      this.onParentChanged(this.getSearchParams());
    }
  }

  constructor(
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected advanceSearch: AdvanceSearch,
    protected queryParamsService: SearchQueryParamsService,
    protected googleAnalyticsService: GoogleAnalyticsService,
  ) {
    this.onInit();
  }

  ngOnInit(): void {
    this.buildSearchFilter([]);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onKeyup(event: any): void {
    this.onKeywordChanged(event.target.value);
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
    this.onSearchTriggered();
    this.onSearchPerformed();
    this.onCurrentPageChanged();
  }

  protected buildSearchForm(params: any = {}): void {
    const controls = Object.assign({ aggregates: {} }, this.params, params);
    this.searchForm = this.formBuilder.group(controls);
  }

  protected addControlToSearchForm(key: string, value: any): void {
    this.searchForm && this.searchForm.addControl(key, new FormControl(value));
  }

  protected buildFormValues(queryParams: any = {}): object {
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

  protected onPageReloaded(params: Params): void {
    const queryParams = Object.assign({}, params);
    delete queryParams['reload'];
    delete queryParams['scroll'];
    this.queryParamsService.changeQueryParams(queryParams, { type: 'pagination' });
  }

  protected onPageQueryParamsChanged(info: PageChangedInfo, event: string = 'onQueryParamsChanged'): void {
    let searchParams = this.buildSearchParams(info.queryParams);
    if (info.queryParams.reload || info.historyState.type === 'reload') {
      this.onPageReloaded(info.queryParams);
    } else if (info.historyState.type === 'pagination') {
      const pageSize = searchParams.pageSize;
      searchParams = this.getNewPageSize(searchParams);
      this.triggerSearch(searchParams, event, { pageSize });
    } else {
      this.triggerSearch(searchParams, event);
    }
  }

  protected onParentChanged(parentParams: any = {}): void {
    const queryValues = this.buildFormValues(this.queryParamsService.getSnapshotQueryParams());
    const params = Object.assign({}, this.getSearchParams(), this.getFormValue(), parentParams, queryValues);
    this.triggerSearch(params, 'onParentChanged');
  }

  protected onKeywordChanged(searchTerm: string): void {
    const params = Object.assign({}, this.getSearchParams(), this.getFormValue(), { ecm_fulltext: searchTerm });
    this.triggerSearch(params, 'onKeywordChanged');
  }

  protected onFilterChanged(aggregateModel: any = {}): void {
    const params = Object.assign({}, this.getSearchParams(), this.getFormValue(), { aggregates: aggregateModel });
    this.triggerSearch(params, 'onFilterChanged');
  }

  protected onSearchPerformed(): void {
    const subscription = this.search$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter((params: SearchParams) => params.params && Object.keys(params.params).length > 0),
      switchMap((params: SearchParams) => this.performSearch(params)),
    ).subscribe();
    this.subscription.add(subscription);
  }

  protected setDefaultParams(params: any = {}): void {
    if (params && Object.keys(params).length > 0) {
      for (const key in params) {
        if (params.hasOwnProperty(key) && this.allowedLinkParams.includes(key)) {
          this.addControlToSearchForm(key, params[key]);
        }
      }
    }
  }

  protected setSearchParams(params: any = {}): void {
    if (params && Object.keys(params).length > 0) {
      this.searchParams = { ...this.params, ...params };
    }
  }

  protected getSearchParams(): any {
    return this.searchParams;
  }

  protected buildSearchParams(queryParams: any = {}): any {
    const queryValues = this.buildFormValues(queryParams);
    return Object.assign({}, this.getSearchParams(), this.getFormValue(), queryValues);
  }

  protected buildQueryParams(): any {
    return this.queryParamsService.buildQueryParams(this.getFormValue(), ['q', 'aggregates'].concat(this.allowedLinkParams));
  }

  protected changeQueryParams(type: string): void {
    if (this.showQuery) {
      const queryParams = Object.assign({}, this.buildQueryParams());
      delete queryParams['scroll'];
      this.queryParamsService.changeQueryParams(queryParams, { type: type });
    }
  }

  protected hasFilterQueryParams(queryParams: {}): boolean {
    return Object.keys(queryParams).some((key) => key.includes('_agg'));
  }

  protected checkPageChanged(info: PageChangedInfo): boolean {
    const type = info.historyState.type;
    // return (this.pageChangedSearch && !['keyword', 'filter'].includes(type)) || (!this.pageChangedSearch && (['reload', 'pagination', 'scroll'].includes(type)));
    return !['keyword', 'filter'].includes(type);
  }

  protected onInitialCurrentPage(): Observable<boolean> {
    return this.router.events.pipe(
      startWith(null),
      filter(event => event === null || event instanceof NavigationEnd),
      pairwise(),
      map(([prev, current]: [NavigationEnd, NavigationEnd]) => this.isPageChanged(prev, current)),
      filter(res => !!res),
    );
  }

  private isPageChanged(prev: NavigationEnd, current: NavigationEnd) {
    return !prev || getPathPartOfUrl(prev.url) !== getPathPartOfUrl(current.url);
  }

  protected onCurrentPageChanged(): void {
    const subscription = this.onInitialCurrentPage().pipe(
      merge(this.queryParamsService.onQueryParamsChanged()),
      skipUntil(this.onInitialCurrentPage()),
      // tslint:disable-next-line:max-line-length
      map((data: any) => new PageChangedInfo({ initial: (data === true), queryParams: this.queryParamsService.getSnapshotQueryParams(), historyState: this.router.getCurrentNavigation().extras ? (this.router.getCurrentNavigation().extras.state || {}) : {} })),
      filter((info: PageChangedInfo) => this.checkPageChanged(info)),
      delay(100),
    ).subscribe((info: PageChangedInfo) => {
      if (info.initial) {
        this.setDefaultParams(info.queryParams);
        this.onPageQueryParamsChanged(info, 'onPageInitialized');
        this.showFilter = this.hasFilterQueryParams(info.queryParams);
      } else {
        this.onPageQueryParamsChanged(info);
      }
    });
    this.subscription.add(subscription);
  }

  protected performSearch(params: SearchParams): Observable<SearchResponse> {
    let event = 'GlobalSearch';
    const formValue = { ...params.params, ...params.defaults, ... { currentPageIndex: 0 } };
    switch (params.event) {
      case 'onPageInitialized':
        event = 'PageInitialized';
        this.patchFormValue(formValue);
        break;
      case 'onQueryParamsChanged':
        event = 'QueryParamsChanged';
        this.patchFormValue(formValue);
        break;
      case 'onParentChanged':
        event = 'CurrentDocumentChanged';
        this.patchFormValue(formValue); // should update form params
        break;
      case 'onKeywordChanged':
        event = 'SearchTermChanged';
        this.changeQueryParams('keyword'); // should update query params
        break;
      case 'onFilterChanged':
        event = 'FormFilterChanged';
        this.changeQueryParams('filter');
        break;
      default:
        break;
    }
    const searchParams = removeUselessObject(params.params, ['q', 'id', 'folder']);
    this.googleAnalyticsService.searchTrack({ 'event_category': 'Search', 'event_action': event, 'event_label': event });
    return this.search(searchParams);
  }

  protected search(queryParams: any = {}): Observable<SearchResponse> {
    const params = new NuxeoPageProviderParams(this.queryParamsService.buildSearchParams(queryParams));
    const options = new NuxeoRequestOptions({ skipAggregates: false });
    const { searchParams, opts } = this.beforeSearch.call(this, params, options);
    return this.advanceSearch.search(searchParams, opts);
  }

  protected triggerSearch(searchParams: any = {}, event: string, defaultValue: any = {}): void {
    this.search$.next(new SearchParams(searchParams, event, defaultValue));
  }

  protected onSearchTriggered(): void {
    this.onBeforeSearch();
    this.onAfterSearch();
  }

  protected onBeforeSearch(): void {
    const subscription = this.advanceSearch.onSearch().pipe(
      filter(({ action }) => action === 'beforeSearch'),
    ).subscribe((_: any) => {
      this.submitted = true;
    });
    this.subscription.add(subscription);
  }

  protected onAfterSearch(): void {
    const subscription = this.advanceSearch.onSearch().pipe(
      filter(({ action }) => action === 'afterSearch'),
      tap(({ response }) => {
        const aggregateModels = this.advanceSearch.buildAggregateModels(response);
        const subscription1 = this.advanceSearch.requestIDsOfAggregates(aggregateModels).subscribe((models: AggregateModel[]) => {
          this.buildSearchFilter(models);
          this.hasAggs = true;
        });
        this.subscription.add(subscription1);
      }),
    ).subscribe((_: any) => {
      this.submitted = false;
    });
    this.subscription.add(subscription);
  }

  protected buildSearchFilter(aggregateModels: AggregateModel[] = []): void {
    this.aggregateModels$.next(filterAggregates(this.filters, aggregateModels));
  }

}
