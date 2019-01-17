import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AdvanceSearch, AggregateModel, filterAggregates } from '@core/api';
import { takeWhile, map } from 'rxjs/operators';
import { DEFAULT_SEARCH_FILTER_ITEM, SearchQueryParamsService } from '@pages/shared';
import { BehaviorSubject } from 'rxjs';
import { selectObjectByKeys } from '@core/services';
import { NUXEO_META_INFO } from '@environment/environment';

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

  showFilter: boolean = false;

  aggregateModels$ = new BehaviorSubject<AggregateModel[]>([]);

  private params: any = {
    pageSize: 20,
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_primaryType: NUXEO_META_INFO.LIBRARY_IMAGE_VIDEO_AUDIO_TYPES,
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
    this.showFilter = this.hasFilterQueryParams(this.queryParamsService.getCurrentQueryParams());
  }

  ngOnDestroy() {
    this.alive = false;
  }

  onSubmit(): void {
    this.changeQueryParams();
  }

  onReset(): void {
    this.searchForm.patchValue(Object.assign({ aggregates: {} }, this.params), { emitEvent: false });
    this.changeQueryParams();
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  private createForm() {
    const params = Object.assign({ aggregates: {} }, this.params);
    this.searchForm = this.formBuilder.group(params);
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
    this.searchForm.patchValue(params, { emitEvent: false });
  }

  private buildQueryParams(): any {
    return this.queryParamsService.buildQueryParams(this.searchForm.value);
  }

  private buildSearchParams(): object {
    return this.queryParamsService.buildSearchParams(this.searchForm.value);
  }

  private hasQueryParams(queryParams: {}): boolean {
    return Object.keys(queryParams).length > 0;
  }

  private hasFilterQueryParams(queryParams: {}): boolean {
    const keys = Object.keys(queryParams);
    for (const key of keys) {
      if (key.includes('_agg')) {
        return true;
      }
    }
    return false;
  }

  private onPageChanged(): void {
    if (!this.hasQueryParams(this.queryParamsService.getCurrentQueryParams())) {
      this.getSearchAggregates();
    }
  }

  private onQueryParamsChanged(): void {
    this.queryParamsService.onQueryParamsChanged()
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe(queryParams => {
        if (this.hasQueryParams(queryParams)) {
          this.setFormValues(queryParams);
          this.onSearch();
        }
      });
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
    this.advanceSearch.onSearch().pipe(
      map(({ response, queryParams }) => {
        return { aggregateModels: this.advanceSearch.buildAggregateModels(response), queryParams };
      }),
    ).subscribe(({ aggregateModels, queryParams }) => {
      if (queryParams.ecm_fulltext === undefined || this.previouSearchTerm !== queryParams.ecm_fulltext) {
        this.previouSearchTerm = queryParams.ecm_fulltext;
        this.advanceSearch.requestIDsOfAggregates(aggregateModels).subscribe((models: AggregateModel[]) => {
          this.changeSearchFilter(models);
        });
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
