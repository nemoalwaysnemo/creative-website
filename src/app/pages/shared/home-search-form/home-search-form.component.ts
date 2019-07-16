import { OnInit, Component, OnDestroy, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Subscription, BehaviorSubject, Subject, Observable } from 'rxjs';
import { ActivatedRoute, Router, Params, Event, NavigationEnd, ParamMap } from '@angular/router';
import { filter, tap, debounceTime, distinctUntilChanged, switchMap, delay, map } from 'rxjs/operators';
import { DocumentModel, AdvanceSearch, AggregateModel, filterAggregates, SearchResponse, NuxeoPageProviderParams, NuxeoRequestOptions } from '@core/api';
import { GoogleAnalyticsService } from '@core/google-analytics';
import { NbLayoutScrollService } from '@core/nebular/theme/services/scroll.service.ts';
import { removeUselessObject } from '@core/services';
import { SearchQueryParamsService } from '../services/search-query-params.service';

class PageChangedInfo {
  readonly queryParams: Params;
  readonly historyState: { [k: string]: any };
  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}

class SearchParams {
  readonly params: { [k: string]: any } = {};
  readonly event: string;
  constructor(params: any = {}, event: string) {
    this.params = params;
    this.event = event;
  }
}

@Component({
  selector: 'home-search-form',
  templateUrl: './home-search-form.component.html',
  styleUrls: ['./home-search-form.component.scss'],
})

export class HomeSearchFormComponent implements OnInit, OnDestroy {

  results: DocumentModel[];
  documents: DocumentModel[] = [];
  queryField: FormControl = new FormControl();
  backgroudUrl: string = '';
  layout: string = 'suggestion-inline';
  searchForm: FormGroup;
  showFilter: boolean = false;
  loading: boolean = false;
  private subscription: Subscription = new Subscription();
  submitted: boolean = false;
  hasAggs: boolean = false;
  aggregateModels$ = new BehaviorSubject<AggregateModel[]>([]);
  private search$: Subject<SearchParams> = new Subject();
  private pageChangedSearch: boolean = true;
  private params: any = {
    currentPageIndex: 0,
    pageSize: 20,
    ecm_fulltext: '',
    aggregates: {},
  };
  private searchParams: any = {};
  private forceStopScoll: boolean = false;
  private preventDocHide: boolean = false;
  private isInitialSearch: boolean = true;
  @Input() headline: string;
  @Input() extraHeadline: string = '';
  @Input() subHead: string;
  @Input() placeholder: string;
  @Input() assetUrl: string;
  @Input() assetUrlMapping: object = {};
  @Input() redirectUrl: string;
  @Input() beforeSearch: Function = (queryParams: NuxeoPageProviderParams, opts: NuxeoRequestOptions): { queryParams: NuxeoPageProviderParams, opts: NuxeoRequestOptions } => ({ queryParams, opts });
  @Input() showQuery: boolean = true;
  @Input() filters: { [key: string]: { placeholder: string } } = {};
  @Input() showInput: boolean = true;
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
    private router: Router,
    private formBuilder: FormBuilder,
    private advanceSearch: AdvanceSearch,
    private googleAnalyticsService: GoogleAnalyticsService,
    private scrollService: NbLayoutScrollService,
    private queryParamsService: SearchQueryParamsService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.onInit();
  }

  ngOnInit() {
    this.createForm();
    this.buildSearchFilter([]);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  show(): void {
    this.documents = this.isInitialSearch ? this.documents = [] : this.results;
    if (this.documents && this.documents.length > 0) {
      this.stopSectionScroll();
    }
  }

  hide(): void {
    if (!this.forceStopScoll) {
      this.startSectionScroll();
    }
    if (!this.preventDocHide) {
      this.documents = [];
    }
    this.forceStopScoll = false;
    this.preventDocHide = false;
  }

  onKeyenter(event: KeyboardEvent): void {
    const params = this.buildQueryParams();
    this.redirectToListPage(params);
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  onKeyup(event: any): void {
    this.onKeywordChanged(event.target.value);
  }

  getAssetUrl(doc: DocumentModel): string {
    return this.assetUrl ? this.assetUrl : this.matchAssetUrl(doc);
  }

  onFilterSelected(aggregateModel: any): void {
    this.onFilterChanged(aggregateModel);
  }

  preventHide(pre: boolean) {
    this.preventDocHide = pre;
  }

  private matchAssetUrl(doc: DocumentModel): string {
    return this.assetUrlMapping[doc.type] ? this.assetUrlMapping[doc.type] : this.assetUrlMapping['*'];
  }

  private buildQueryParams(): any {
    return { q: this.queryField.value };
  }

  private createForm(): void {
    this.searchForm = this.formBuilder.group(this.params);
  }

  private redirectToListPage(queryParams: {}): void {
    this.router.navigate([this.redirectUrl], { queryParamsHandling: 'merge', queryParams });
  }

  private stopSectionScroll() {
    this.scrollService.runSectionScroll(false);
  }

  private startSectionScroll() {
    this.scrollService.runSectionScroll(true);
  }

  onFilterBlur(aggregateModel: any): void {
    this.onFilterChanged(aggregateModel);
  }

  toggleFilter(): void {
    if (!this.submitted) {
      this.showFilter = !this.showFilter;
    }
    if (this.showFilter) {
      this.stopSectionScroll();
      this.forceStopScoll = true;
    }
    this.preventDocHide = true;
  }

  hasFilters(): boolean {
    return this.filters && Object.keys(this.filters).length > 0;
  }

  isShowInput(): boolean {
    return this.showInput;
  }

  private onInit(): void {
    this.onRefreshSearch();
    this.buildSearchForm();
    this.onSearchTriggered();
    this.onSearchPerformed();
    this.onCurrentPageChanged();
  }

  private buildSearchForm(params: any = {}): void {
    const controls = Object.assign({ aggregates: {} }, this.params, params);
    this.searchForm = this.formBuilder.group(controls);
  }

  private buildFormValues(queryParams: any = {}): object {
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

  private patchFormValue(params: { [key: string]: any }): void {
    this.searchForm.patchValue(params);
  }

  private getFormValue(): any {
    return this.searchForm.getRawValue();
  }

  private onQueryParamsChanged(queryParams: any = {}): void {
    queryParams = queryParams || {};
    const queryValues = this.buildFormValues(queryParams);
    const params = Object.assign({}, this.getSearchParams(), this.getFormValue(), queryValues);
    this.search$.next({ params, event: 'onQueryParamsChanged' });
  }

  private onParentChanged(parentParams: any = {}): void {
    const queryValues = this.buildFormValues(this.activatedRoute.snapshot.queryParams);
    const params = Object.assign({}, this.getSearchParams(), this.getFormValue(), parentParams, queryValues);
    this.search$.next({ params, event: 'onParentChanged' });
  }

  private onKeywordChanged(searchTerm: string): void {
    let params = { currentPageIndex: 0, ecm_fulltext: searchTerm };
    params = Object.assign({}, this.getSearchParams(), this.getFormValue(), params);
    this.search$.next({ params, event: 'onKeywordChanged' });
  }

  private onFilterChanged(aggregateModel: any = {}): void {
    const params = Object.assign({}, this.getSearchParams(), this.getFormValue(), { aggregates: aggregateModel });
    this.search$.next({ params, event: 'onFilterChanged' });
  }

  private onSearchPerformed(): void {
    const subscription = this.search$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter((params: SearchParams) => params.params && Object.keys(params.params).length > 0),
      switchMap((params: SearchParams) => this.performSearch(params)),
    ).subscribe((res) => {
      let searchFilter = false;
      if (res.response.entries.length > 0) {
        this.stopSectionScroll();
      }
      this.results = res.response.entries;
      const searchText = !!res.queryParams['ecm_fulltext'];
      for (const key in res.queryParams) {
        if (key in this.filters) {
          searchFilter = true;
        }
      }
      this.isInitialSearch = !(searchText || searchFilter);
      this.isInitialSearch ? this.hide() : this.show();
    });
    this.subscription.add(subscription);
  }

  private setSearchParams(params: any = {}): void {
    if (params && Object.keys(params).length > 0) {
      this.searchParams = Object.assign({}, this.params, params);
    }
  }

  private getSearchParams(): any {
    return this.searchParams;
  }

  private changeQueryParams(): void {
    const queryParams = this.queryParamsService.buildQueryParams(this.getFormValue());
    this.queryParamsService.changeQueryParams(queryParams, { type: 'keyword' });
  }

  private hasFilterQueryParams(queryParams: {}): boolean {
    return Object.keys(queryParams).some((key) => key.includes('_agg'));
  }

  private onRefreshSearch(): void {
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

  private checkPageChanged(info: PageChangedInfo): boolean {
    const type = info.historyState.type;
    return (this.pageChangedSearch && type !== 'keyword') || (!this.pageChangedSearch && (type === 'pagination' || type === 'refresh'));
  }

  private onPageChanged(): Observable<PageChangedInfo> {
    return this.router.events.pipe(
      filter((e: Event) => e instanceof NavigationEnd),
      map(_ => new PageChangedInfo({ queryParams: this.activatedRoute.snapshot.queryParams, historyState: this.router.getCurrentNavigation().extras ? (this.router.getCurrentNavigation().extras.state || {}) : {} })),
    );
  }

  private onCurrentPageChanged(): void {
    const subscription = this.onPageChanged().pipe(
      delay(100),
      filter((info: PageChangedInfo) => this.checkPageChanged(info)),
    ).subscribe((info: PageChangedInfo) => {
      this.onQueryParamsChanged(info.queryParams);
      if (this.hasFilterQueryParams(info.queryParams)) {
        this.showFilter = true;
      }
    });
    this.subscription.add(subscription);
  }

  private performSearch(params: SearchParams): Observable<SearchResponse> {
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

  private search(searchParams: any = {}): Observable<SearchResponse> {
    const params = new NuxeoPageProviderParams(this.queryParamsService.buildSearchParams(searchParams));
    const options = new NuxeoRequestOptions({ skipAggregates: false });
    const { queryParams, opts } = this.beforeSearch.call(this, params, options);
    return this.advanceSearch.search(queryParams, opts);
  }

  private onSearchTriggered(): void {
    this.onBeforeSearch();
    this.onAfterSearch();
  }

  private onBeforeSearch(): void {
    const subscription = this.advanceSearch.onSearch().pipe(
      filter(({ action }) => action === 'beforeSearch'),
    ).subscribe((_: any) => {
      this.submitted = true;
    });
    this.subscription.add(subscription);
  }

  private onAfterSearch(): void {
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

  private buildSearchFilter(aggregateModels: AggregateModel[] = []): void {
    this.aggregateModels$.next(filterAggregates(this.filters, aggregateModels));
  }
}
