import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AdvanceSearch, AggregateModel, filterAggregates } from '@core/api';
import { DEFAULT_SEARCH_FILTER_ITEM, SearchQueryParamsService } from '../../../shared';
import { selectObjectByKeys } from '@core/services';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'tbwa-search-form',
  styleUrls: ['./search-form.component.scss'],
  templateUrl: './search-form.component.html',
})
export class SearchFormComponent implements OnInit, OnDestroy {

  private previouSearchTerm: string;

  private subscription: Subscription = new Subscription();

  searchForm: FormGroup;

  submitted: boolean = false;

  showFilter: boolean = false;

  aggregateModels$ = new BehaviorSubject<AggregateModel[]>([]);

  private params: any = {
    pageSize: 20,
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
  };

  constructor(
    private formBuilder: FormBuilder,
    private advanceSearch: AdvanceSearch,
    private queryParamsService: SearchQueryParamsService,
  ) {

  }

  ngOnInit() {
    this.createForm();
    this.onPageChanged();
    this.onSearchResponse();
    this.onQueryParamsChanged();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit(): void {
    this.patchFormValue({ currentPageIndex: 0 });
    this.onSearch();
    this.changeQueryParams();
  }

  onReset(): void {
    this.patchFormValue(Object.assign({ aggregates: {} }, this.params));
    this.onSearch();
    this.changeQueryParams();
  }

  toggleFilter(): void {
    if (!this.submitted) {
      this.showFilter = !this.showFilter;
    }
  }

  private createForm() {
    const params = Object.assign({ aggregates: {} }, this.params);
    this.searchForm = this.formBuilder.group(params);
    this.changeSearchFilter([]);
  }

  private setFormValues(queryParams: any): void {
    let params = Object.assign({ aggregates: {} }, this.params);
    if (queryParams.q) {
      params.ecm_fulltext = queryParams.q;
    }
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

  private buildQueryParams(): any {
    return this.queryParamsService.buildQueryParams(this.getFormValue());
  }

  private buildSearchParams(): object {
    return this.queryParamsService.buildSearchParams(this.getFormValue());
  }

  private getFormValue(): any {
    return this.searchForm.getRawValue();
  }

  private patchFormValue(params: { [key: string]: any }): void {
    this.searchForm.patchValue(params);
  }

  private hasQueryParams(queryParams: {}): boolean {
    return Object.keys(queryParams).length > 0;
  }

  private hasFilterQueryParams(queryParams: {}): boolean {
    return Object.keys(queryParams).some((key) => key.includes('_agg'));
  }

  private onPageChanged(): void {
    if (!this.hasQueryParams(this.queryParamsService.getCurrentQueryParams())) {
      this.getSearchAggregates();
    } else if (this.hasFilterQueryParams(this.queryParamsService.getCurrentQueryParams())) {
      this.showFilter = true;
    }
  }

  private onQueryParamsChanged(): void {
    const subscription = this.queryParamsService.onQueryParamsChanged().pipe(
      filter((queryParams) => !this.submitted && this.hasQueryParams(queryParams)),
    ).subscribe(queryParams => {
      this.setFormValues(queryParams);
      this.onSearch();
    });
    this.subscription.add(subscription);
  }

  private changeQueryParams(): void {
    this.queryParamsService.changeQueryParams([], this.buildQueryParams());
  }

  private onClear(): void {
    this.setFormValues(this.params);
  }

  private onSearch(): void {
    this.submitted = true;
    this.advanceSearch.search(this.buildSearchParams());
  }

  private onSearchResponse(): void {
    const subscription = this.advanceSearch.onSearch().pipe(
      map(({ response, queryParams, action }) => {
        return { aggregateModels: this.advanceSearch.buildAggregateModels(response), queryParams, action };
      }),
      filter(({ action }) => action === 'afterSearch'),
    ).subscribe(({ aggregateModels, queryParams }) => {
      if (queryParams.ecm_fulltext === undefined || this.previouSearchTerm !== queryParams.ecm_fulltext) {
        this.previouSearchTerm = queryParams.ecm_fulltext;
        const subscription1 = this.advanceSearch.requestIDsOfAggregates(aggregateModels).subscribe((models: AggregateModel[]) => {
          this.changeSearchFilter(models);
        });
        this.subscription.add(subscription1);
      }
      this.submitted = false;
    });
    this.subscription.add(subscription);
  }

  private getSearchAggregates(): void {
    const subscription = this.advanceSearch.requestSearchFilters(this.params).subscribe((aggregateModels: AggregateModel[]) => {
      this.changeSearchFilter(aggregateModels);
    });
    this.subscription.add(subscription);
  }

  private changeSearchFilter(aggregateModels: AggregateModel[]): void {
    this.aggregateModels$.next(filterAggregates(DEFAULT_SEARCH_FILTER_ITEM, aggregateModels));
  }

}
