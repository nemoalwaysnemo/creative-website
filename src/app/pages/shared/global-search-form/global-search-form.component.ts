import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BehaviorSubject, Subscription, Subject, Observable } from 'rxjs';
import { filter, tap, debounceTime, distinctUntilChanged, switchMap, delay } from 'rxjs/operators';
import { AdvanceSearch, AggregateModel, filterAggregates, SearchResponse } from '@core/api';
import { SearchQueryParamsService, PageChangedInfo } from '../services/search-query-params.service';
import { selectObjectByKeys } from '@core/services';
import { Params } from '@angular/router';

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

  @Input() showQuery: boolean = true;

  @Input() placeholder: string = 'Search for...';

  @Input() filters: { [key: string]: { placeholder: string } } = {};

  @Input() baseParams: any = {
    currentPageIndex: 0,
    pageSize: 20,
    ecm_fulltext: '',
  };

  constructor(
    private formBuilder: FormBuilder,
    private advanceSearch: AdvanceSearch,
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
    this.search$.next(value);
  }

  onFilterClose(value: any): void {
    this.search$.next(value);
  }

  toggleFilter(): void {
    if (!this.submitted) {
      this.showFilter = !this.showFilter;
    }
  }

  hasFilters(): boolean {
    return this.filters && Object.keys(this.filters).length > 0;
  }

  private onTypeahead(): Observable<SearchResponse> {
    this.patchFormValue({ currentPageIndex: 0 });
    if (this.showQuery) {
      this.changeQueryParams();
    }
    return this.search();
  }

  private onSubmit(): void {
    this.patchFormValue({ currentPageIndex: 0 });
    this.search().subscribe();
  }

  private onReset(params: any = {}): void {
    this.setFormValues(params);
    this.search().subscribe();
  }

  private onInit() {
    this.onSearch();
    this.createForm();
    this.onPageChanged();
  }

  private onSearchEvent() {
    const subscription = this.search$.pipe(
      filter((searchTerm: string) => searchTerm !== null),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(_ => this.onTypeahead()),
    ).subscribe();
    this.subscription.add(subscription);
  }

  private search(): Observable<SearchResponse> {
    const params = Object.assign({}, this.baseParams, this.getFormValue());
    return this.advanceSearch.search(this.queryParamsService.buildSearchParams(params));
  }

  private createForm() {
    const params = Object.assign({ aggregates: {} }, this.baseParams);
    this.searchForm = this.formBuilder.group(params);
  }

  private setFormValues(queryParams: any = {}): void {
    let params = Object.assign({ aggregates: {} }, this.baseParams);
    params.ecm_fulltext = queryParams.q || '';
    const keys = Object.keys(queryParams);
    for (const key of keys) {
      if (key.includes('_agg')) {
        params.aggregates[key] = typeof queryParams[key] === 'string' ? [queryParams[key]] : queryParams[key];
      } else {
        params[key] = queryParams[key];
      }
    }
    params = selectObjectByKeys(params, ['ecm_fulltext', 'pageSize', 'currentPageIndex', 'aggregates']);
    this.patchFormValue(params);
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

  private hasQueryParams(queryParams: {}): boolean {
    return Object.keys(queryParams).length > 0;
  }

  private hasFilterQueryParams(queryParams: {}): boolean {
    return Object.keys(queryParams).some((key) => key.includes('_agg'));
  }

  private onPageChanged(): void {
    const subscription = this.queryParamsService.onPageChanged().pipe(
      filter((info: PageChangedInfo) => info.historyState.type !== 'typeahead'),
      delay(300),
    ).subscribe((info: PageChangedInfo) => {
      if (!this.hasQueryParams(info.queryParams)) {
        this.getSearchAggregates();
      } else {
        this.onReset(info.queryParams);
        if (this.hasFilterQueryParams(info.queryParams)) {
          this.showFilter = true;
        }
      }
    });
    this.subscription.add(subscription);
  }

  private onSearch(): void {
    this.onSearchEvent();
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

  private getSearchAggregates(): void {
    const subscription = this.advanceSearch.requestSearchFilters(this.baseParams).subscribe((aggregateModels: AggregateModel[]) => {
      this.changeSearchFilter(aggregateModels);
      this.hasAggs = true;
    });
    this.subscription.add(subscription);
  }

  private changeSearchFilter(aggregateModels: AggregateModel[] = []): void {
    this.aggregateModels$.next(filterAggregates(this.filters, aggregateModels));
  }

}
