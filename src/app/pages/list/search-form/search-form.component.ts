import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdvanceSearch, AggregateModel, filterAggregates } from '@core/api';
import { filterParams } from '@core/services';
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

  searchForm: FormGroup;

  submitted: boolean = false;

  aggregateModels$ = new BehaviorSubject<AggregateModel[]>([]);

  private params: any = {
    pageSize: 16,
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_path: '/Creative/TBWA-/',
    ecm_primaryType: '["App-Library-Video", "App-Library-Image"]',
  };

  constructor(
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
    this.onReset();
  }

  private createForm() {
    const params = Object.assign({ aggregates: '' }, this.params);
    this.searchForm = this.formBuilder.group(params);
  }

  private getFormValue(): object {
    const values = filterParams(this.searchForm.value);
    if (values.aggregates) {
      const keys = Object.keys(values.aggregates);
      for (const key of keys) {
        values[key] = `["${values.aggregates[key].join('", "')}"]`;
      }
      delete values.aggregates;
    }
    return values;
  }

  private hasQueryParams(queryParams: {}): boolean {
    return Object.keys(filterParams(queryParams)).length > 0;
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
          this.onReset();
        }
      });
  }

  private setFormValues(queryParams: any): void {
    const params: any = {};
    if (queryParams.q) {
      params.ecm_fulltext = queryParams.q;
    }
    this.searchForm.patchValue(params, { emitEvent: false });
    // TODO: set query filters
    // const keys = Object.keys(queryParams);
    // for (const key of keys) {

    // }
  }

  private onClear(): void {
    this.setFormValues(this.params);
  }

  private onReset(): void {
    this.searchForm.patchValue({ currentPageIndex: 0 }, { emitEvent: false });
    this.onSearch();
  }

  private onSearch(): void {
    this.submitted = true;
    this.advanceSearch.search(this.getFormValue());
  }

  private onSearchResponse(): void {
    this.advanceSearch.onSearch().pipe(
      map(({ response }) => this.advanceSearch.buildAggregateModels(response)),
    ).subscribe((aggregateModels: AggregateModel[]) => {
      this.submitted = false;
      this.changeSearchFilter(aggregateModels);
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
