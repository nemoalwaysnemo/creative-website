import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Router, Params, Event, NavigationEnd } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BehaviorSubject, Subscription, Subject, Observable } from 'rxjs';
import { filter, tap, debounceTime, distinctUntilChanged, switchMap, delay, map } from 'rxjs/operators';
import { AdvanceSearch, AggregateModel, filterAggregates, SearchResponse } from '@core/api';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { selectObjectByKeys } from '@core/services';

class PageChangedInfo {
  readonly queryParams: Params;
  readonly historyState: { [k: string]: any };
  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}

@Component({
  selector: 'tbwa-global-search-form',
  styleUrls: ['./global-search-form.component.scss'],
  templateUrl: './global-search-form.component.html',
})
export class GlobalSearchFormComponent implements OnInit, OnDestroy {

  searchForm: FormGroup;

  submitted: boolean = false;

  showFilter: boolean = false;

  hasAggs: boolean = false;

  aggregateModels$ = new BehaviorSubject<AggregateModel[]>([]);

  private subscription: Subscription = new Subscription();

  private search$: Subject<any> = new Subject();

  private pageChangedSearch: boolean = true;

  private _defaultParams: any = {
    currentPageIndex: 0,
    pageSize: 20,
    ecm_fulltext: '',
  };

  private searchParams: any = {};

  @Input() showQuery: boolean = true;

  @Input() placeholder: string = 'Search for...';

  @Input() filters: { [key: string]: { placeholder: string } } = {};

  @Input()
  set defaultParams(params: any) {
    this.pageChangedSearch = true;
    if (params) {
      this.searchParams = Object.assign({}, this._defaultParams, params);
    }
  }

  @Input()
  set baseParams(params: any) {
    this.pageChangedSearch = false;
    if (params) {
      this.searchParams = Object.assign({}, this._defaultParams, params);
      this.onInputChangedSearch(this.searchParams);
    }
  }

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private advanceSearch: AdvanceSearch,
    private activatedRoute: ActivatedRoute,
    private queryParamsService: SearchQueryParamsService,
  ) {
    this.onInit();
  }

  ngOnInit() {
    this.changeSearchFilter([]);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onKeyup(value: string): void {
    this.onTypeahead(value).subscribe();
  }

  onFilterClose(value: any): void {
    this.onTypeahead(value).subscribe();
  }

  toggleFilter(): void {
    if (!this.submitted) {
      this.showFilter = !this.showFilter;
    }
  }

  hasFilters(): boolean {
    return this.filters && Object.keys(this.filters).length > 0;
  }

  private onTypeahead(searchTerm: string): Observable<SearchResponse> {
    if (this.showQuery) {
      this.changeQueryParams();
    }
    return this.search({ currentPageIndex: 0, ecm_fulltext: searchTerm });
  }

  private onInputChangedSearch(params: any = {}): void {
    const queryParams = Object.assign({}, this.activatedRoute.snapshot.queryParams, params);
    const parsedParams = this.parseToFormValues(queryParams);
    this.patchFormValue(parsedParams);
    this.search(parsedParams).subscribe();
  }

  private onQuerySearch(queryParams: any = {}): void {
    const params = queryParams || {};
    const parsedParams = this.parseToFormValues(params);
    this.patchFormValue(parsedParams);
    this.search(parsedParams).subscribe();
  }

  private onInit() {
    this.onSearch();
    this.createForm();
    this.onCurrentPageChanged();
  }

  private onSearchEvent() {
    const subscription = this.search$.pipe(
      filter((searchTerm: string) => searchTerm !== null),
      debounceTime(100),
      distinctUntilChanged(),
      switchMap((searchTerm: string) => this.onTypeahead(searchTerm)),
    ).subscribe();
    this.subscription.add(subscription);
  }

  private search(searchParams: any = {}): Observable<SearchResponse> {
    const params = Object.assign({}, this.searchParams, searchParams, this.getFormValue());
    return this.advanceSearch.search(this.queryParamsService.buildSearchParams(params), { skipAggregates: false });
  }

  private createForm() {
    const params = Object.assign({ aggregates: {} }, this._defaultParams);
    this.searchForm = this.formBuilder.group(params);
  }

  private parseToFormValues(queryParams: any = {}): object {
    const params = Object.assign({ aggregates: {} }, this.searchParams);
    params.ecm_fulltext = queryParams.q || '';
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

  private changeQueryParams(): void {
    const queryParams = this.queryParamsService.buildQueryParams(this.getFormValue());
    this.queryParamsService.changeQueryParams(queryParams, { type: 'typeahead' });
  }

  private hasFilterQueryParams(queryParams: {}): boolean {
    return Object.keys(queryParams).some((key) => key.includes('_agg'));
  }

  private checkPageChanged(info: PageChangedInfo): boolean {
    const type = info.historyState.type;
    return (this.pageChangedSearch && type !== 'typeahead') || (!this.pageChangedSearch && type === 'pagination');
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
      this.onQuerySearch(info.queryParams);
      if (this.hasFilterQueryParams(info.queryParams)) {
        this.showFilter = true;
      }
    });
    this.subscription.add(subscription);
  }

  private onSearch(): void {
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
          this.changeSearchFilter(models);
          this.hasAggs = true;
        });
        this.subscription.add(subscription1);
      }),
    ).subscribe((_: any) => {
      this.submitted = false;
    });
    this.subscription.add(subscription);
  }

  private changeSearchFilter(aggregateModels: AggregateModel[] = []): void {
    this.aggregateModels$.next(filterAggregates(this.filters, aggregateModels));
  }

}
