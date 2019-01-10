import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdvanceSearch, AggregateModel, filterAggregates } from '@core/api';
import { filterParams, selectObjectByKeys } from '@core/services';
import { takeWhile, distinctUntilChanged, map } from 'rxjs/operators';
import { DEFAULT_SEARCH_FILTER_ITEM } from '@pages/shared';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'tbwa-search-form',
  styleUrls: ['./search-form.component.scss'],
  templateUrl: './search-form.component.html',
})
export class SearchFormComponent implements OnInit, OnDestroy {

  private alive: boolean = true;

  private previouSearchTerm: string;

  searchForm: FormGroup;

  submitted: boolean = false;

  aggregateModels$ = new BehaviorSubject<AggregateModel[]>([]);

  private params: any = {
    pageSize: 20,
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_path: '/Creative/TBWA-/',
    ecm_primaryType: '["App-Library-Video", "App-Library-Image"]',
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private advanceSearch: AdvanceSearch,
  ) {

  }

  ngOnInit() {
    this.createForm();
    this.onPageChanged();
    this.onSearchResponse();
    this.onQueryParamsChanged();
  }

  ngOnDestroy() {
    this.alive = false;
  }

  onSubmit(): void {
    this.changeQueryParams(this.getFormValue());
  }

  onReset(): void {
    this.searchForm.patchValue(Object.assign({ aggregates: {} }, this.params), { emitEvent: false });
    this.changeQueryParams(this.getFormValue());
  }

  private createForm() {
    const params = Object.assign({ aggregates: {} }, this.params);
    this.searchForm = this.formBuilder.group(params);
  }

  private setFormValues(queryParams: any): void {
    const params: any = {};
    const aggregates: any = {};
    if (queryParams.q) {
      params.ecm_fulltext = queryParams.q;
    }
    const keys = Object.keys(queryParams);
    for (const key of keys) {
      if (key.includes('_agg')) {
        aggregates[key] = typeof queryParams[key] === 'string' ? [queryParams[key]] : queryParams[key];
      }
    }
    params.aggregates = aggregates;
    this.searchForm.patchValue(params, { emitEvent: false });
  }

  private getFormValue(): object {
    let values = filterParams(this.searchForm.value);
    values.q = values.ecm_fulltext ? values.ecm_fulltext : '';
    values = selectObjectByKeys(values, ['q', 'aggregates']);
    if (values.aggregates) {
      Object.keys(values.aggregates).forEach((key) => { values[key] = values.aggregates[key]; });
      delete values.aggregates;
    }
    return values;
  }

  private getSearchParams(): object {
    const values = filterParams(this.searchForm.value);
    if (values.aggregates) {
      Object.keys(values.aggregates).forEach((key) => { values[key] = `["${values.aggregates[key].join('", "')}"]`; });
      delete values.aggregates;
    }
    return values;
  }

  private hasQueryParams(queryParams: {}): boolean {
    return Object.keys(queryParams).length > 0;
  }

  private onPageChanged(): void {
    if (!this.hasQueryParams(this.activatedRoute.snapshot.queryParams)) {
      this.getSearchAggregates();
    }
  }

  private onQueryParamsChanged(): void {
    this.activatedRoute.queryParams
      .pipe(
        takeWhile(() => this.alive),
        distinctUntilChanged(),
      )
      .subscribe(queryParams => {
        if (this.hasQueryParams(queryParams)) {
          this.setFormValues(queryParams);
          this.onSearch();
        }
      });
  }

  private changeQueryParams(params: any = {}): void {
    const queryParams = params;
    this.router.navigate([], { relativeTo: this.activatedRoute, queryParams });
  }

  private onClear(): void {
    this.setFormValues(this.params);
  }

  private onSearch(): void {
    this.submitted = true;
    this.advanceSearch.search(this.getSearchParams());
  }

  private onSearchResponse(): void {
    this.advanceSearch.onSearch().pipe(
      map(({ response, queryParams }) => {
        return { aggregateModels: this.advanceSearch.buildAggregateModels(response), queryParams };
      }),
    ).subscribe(({ aggregateModels, queryParams }) => {
      if (this.previouSearchTerm !== queryParams.ecm_fulltext) {
        this.previouSearchTerm = queryParams.ecm_fulltext;
        this.changeSearchFilter(aggregateModels);
      }
      this.submitted = false;
    });
  }

  private getSearchAggregates(): void {
    this.advanceSearch.requestSearchFilters(this.params).subscribe((aggregateModels: AggregateModel[]) => {
      this.changeSearchFilter(aggregateModels);
    });
  }

  private changeSearchFilter(aggregateModels: AggregateModel[]): void {
    this.aggregateModels$.next(filterAggregates(DEFAULT_SEARCH_FILTER_ITEM, aggregateModels));
  }

}
