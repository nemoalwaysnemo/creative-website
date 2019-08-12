import { OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Router, Params, Event, NavigationEnd, ParamMap } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { BehaviorSubject, Subscription, Subject, Observable } from 'rxjs';
import { filter, tap, debounceTime, distinctUntilChanged, switchMap, delay, map } from 'rxjs/operators';
import { AdvanceSearch, AggregateModel, filterAggregates, SearchResponse, NuxeoPageProviderParams, NuxeoRequestOptions } from '@core/api';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { removeUselessObject } from '@core/services';
import { GoogleAnalyticsService } from '@core/google-analytics';

export class PageChangedInfo {
  readonly queryParams: Params;
  readonly historyState: { [k: string]: any };
  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}

export class SearchParams {
  readonly params: { [k: string]: any } = {};
  readonly event: string;
  constructor(params: any = {}, event: string) {
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

  protected pageChangedSearch: boolean = true;

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

  @Input() filters: { [key: string]: { [key: string]: string } } = {};

  @Input() beforeSearch: Function = (searchParams: NuxeoPageProviderParams, opts: NuxeoRequestOptions): { searchParams: NuxeoPageProviderParams, opts: NuxeoRequestOptions } => ({ searchParams, opts });

  @Input()
  set defaultParams(params: any) {
    this.pageChangedSearch = true;
    this.setSearchParams(params);
  }

  @Input()
  set baseParams(params: any) {
    this.pageChangedSearch = false;
    if (params && Object.keys(params).length > 0) {
      this.setSearchParams(params);
      this.onParentChanged(this.getSearchParams());
    }
  }

  constructor(
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
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
    return this.filters && Object.keys(this.filters).length > 0;
  }

  protected onInit(): void {
    this.onRefreshSearch();
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

  protected onQueryParamsChanged(queryParams: any = {}, refresh = false): void {
    queryParams = queryParams || {};
    const queryValues = this.buildFormValues(queryParams);
    const params = Object.assign({}, this.getSearchParams(), this.getFormValue(), queryValues);
    if (refresh && params.currentPageIndex) {
      params.pageSize = parseInt(params.pageSize, 10) * (parseInt(params.currentPageIndex, 10) + 1);
      params.currentPageIndex = 0;
    }
    this.search$.next({ params, event: 'onQueryParamsChanged' });
    refresh = false;
  }

  protected onParentChanged(parentParams: any = {}): void {
    const queryValues = this.buildFormValues(this.activatedRoute.snapshot.queryParams);
    const params = Object.assign({}, this.getSearchParams(), this.getFormValue(), parentParams, queryValues);
    this.search$.next({ params, event: 'onParentChanged' });
  }

  protected onKeywordChanged(searchTerm: string): void {
    let params = { currentPageIndex: 0, ecm_fulltext: searchTerm };
    params = Object.assign({}, this.getSearchParams(), this.getFormValue(), params);
    this.search$.next({ params, event: 'onKeywordChanged' });
  }

  protected onFilterChanged(aggregateModel: any = {}): void {
    const params = Object.assign({}, this.getSearchParams(), this.getFormValue(), { aggregates: aggregateModel });
    this.search$.next({ params, event: 'onFilterChanged' });
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

  protected setPassedParams(params: any = {}): void {
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

  protected buildQueryParams(): any {
    return this.queryParamsService.buildQueryParams(this.getFormValue(), ['q', 'aggregates'].concat(this.allowedLinkParams));
  }

  protected changeQueryParams(): void {
    if (this.showQuery) {
      this.queryParamsService.changeQueryParams(this.buildQueryParams(), { type: 'keyword' });
    }
  }

  protected hasFilterQueryParams(queryParams: {}): boolean {
    return Object.keys(queryParams).some((key) => key.includes('_agg'));
  }

  protected onRefreshSearch(): void {
    const subscription = this.activatedRoute.queryParamMap.pipe(
      delay(100),
    ).subscribe((paramMap: ParamMap) => {
      if (paramMap.has('refresh')) {
        const queryParams = Object.assign({}, this.activatedRoute.snapshot.queryParams);
        delete queryParams['refresh'];
        this.queryParamsService.changeQueryParams(queryParams, { type: 'refresh' });
        this.onQueryParamsChanged(queryParams);
      }
    });
    this.subscription.add(subscription);
  }

  protected checkPageChanged(info: PageChangedInfo): boolean {
    const type = info.historyState.type;
    return (this.pageChangedSearch && type !== 'keyword') || (!this.pageChangedSearch && (type === 'pagination' || type === 'refresh'));
  }

  protected onPageChanged(): Observable<PageChangedInfo> {
    return this.router.events.pipe(
      filter((e: Event) => e instanceof NavigationEnd),
      map(_ => new PageChangedInfo({ queryParams: this.activatedRoute.snapshot.queryParams, historyState: this.router.getCurrentNavigation().extras ? (this.router.getCurrentNavigation().extras.state || {}) : {} })),
    );
  }

  protected onCurrentPageChanged(): void {
    let initialState = true;
    const subscription = this.onPageChanged().pipe(
      delay(100),
      filter((info: PageChangedInfo) => this.checkPageChanged(info)),
    ).subscribe((info: PageChangedInfo) => {
      this.setPassedParams(info.queryParams);
      this.onQueryParamsChanged(info.queryParams, initialState);
      if (this.hasFilterQueryParams(info.queryParams)) {
        this.showFilter = true;
      }
      initialState = false;
    });
    this.subscription.add(subscription);
  }

  protected performSearch(params: SearchParams): Observable<SearchResponse> {
    let event = 'GlobalSearch';
    let searchParams = params.params;
    switch (params.event) {
      case 'onCurrentPageChanged':
        event = 'CurrentPageChanged';
        this.patchFormValue(params.params);
        break;
      case 'onQueryParamsChanged':
        event = 'QueryParamsChanged';
        this.patchFormValue(params.params);
        break;
      case 'onParentChanged':
        event = 'CurrentDocumentChanged';
        this.patchFormValue(params.params);
        break;
      case 'onKeywordChanged':
        event = 'SearchTermChanged';
        this.changeQueryParams();
        break;
      case 'onFilterChanged':
        event = 'FormFilterChanged';
        this.changeQueryParams();
        break;
      default:
        break;
    }
    searchParams = removeUselessObject(searchParams, ['q', 'id', 'folder']);
    this.googleAnalyticsService.searchTrack({ 'event_category': 'Search', 'event_action': event, 'event_label': event });
    return this.search(searchParams);
  }

  protected search(queryParams: any = {}): Observable<SearchResponse> {
    const params = new NuxeoPageProviderParams(this.queryParamsService.buildSearchParams(queryParams));
    const options = new NuxeoRequestOptions({ skipAggregates: false });
    const { searchParams, opts } = this.beforeSearch.call(this, params, options);
    return this.advanceSearch.search(searchParams, opts);
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
