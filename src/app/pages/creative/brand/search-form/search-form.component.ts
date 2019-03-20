import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AdvanceSearch, AggregateModel, filterAggregates } from '@core/api';
import { DEFAULT_SEARCH_FILTER_ITEM, SearchQueryParamsService, BaseAutoSearch } from '../../../shared';
import { selectObjectByKeys, deepExtend } from '@core/services';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { NUXEO_META_INFO } from '@environment/environment';
import { BrandService } from '@pages/creative/brand/brand.service';

@Component({
  selector: 'tbwa-brand-search-form',
  styleUrls: ['./search-form.component.scss'],
  templateUrl: './search-form.component.html',
})
export class SearchFormComponent extends BaseAutoSearch {
  private previouSearchTerm: string;

  searchForm: FormGroup;
  submitted: boolean = false;
  showFilter: boolean = false;

  aggregateModels$ = new BehaviorSubject<AggregateModel[]>([]);

  private params: any = {
    pageSize: 20,
    currentPageIndex: 0,
    ecm_fulltext: '',
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
    ecm_path: '',
  };

  constructor(
    private formBuilder: FormBuilder,
    private advanceSearch: AdvanceSearch,
    private queryParamsService: SearchQueryParamsService,
    private brandSerice: BrandService,
  ) {
    super();
  }

  onInit() {
    this.createForm();
    this.onMessageChange();
    this.onPageChanged();
    this.onSearchResponse();
    this.onQueryParamsChanged();
  }

  onSubmit(): void {
    this.patchFormValue({ currentPageIndex: 0 });
    this.onSearch();
    this.changeQueryParams();
  }

  toggleFilter(): void {
    if (!this.submitted) {
      this.showFilter = !this.showFilter;
    }
  }

  onReset(): void {
    this.patchFormValue(Object.assign({ aggregates: {} }, this.params));
    this.onSearch();
    this.changeQueryParams();
  }

  private onMessageChange() {
    this.params.ecm_path = this.brandSerice.hasBrand() ? this.brandSerice.brand.path : '';
    const subscription = this.brandSerice.onChangeMessage().pipe(map((message) => message.path)).subscribe((path) => {
      this.params.ecm_path = path;
      this.setFormValues(deepExtend({ ecm_path: path }, this.queryParamsService.getCurrentQueryParams()));
      this.onSearch();
      this.getSearchAggregates();
    });
    this.subscription.add(subscription);
  }

  onSearch(): void {
    this.submitted = true;
    this.advanceSearch.search(this.buildSearchParams());
  }

  private buildSearchParams(): object {
    return this.queryParamsService.buildSearchParams(this.getFormValue());
  }

  private changeQueryParams(): void {
    this.queryParamsService.changeQueryParams([], deepExtend({ id: this.brandSerice.brand.uid }, this.buildQueryParams()), '');
  }

  private buildQueryParams(): any {
    return this.queryParamsService.buildQueryParams(this.getFormValue());
  }

  private getFormValue(): any {
    return this.searchForm.getRawValue();
  }

  private patchFormValue(params: { [key: string]: any }): void {
    this.searchForm.patchValue(params);
  }

  private createForm() {
    const params = Object.assign({ aggregates: {} }, this.params);
    this.searchForm = this.formBuilder.group(params);
    this.changeSearchFilter([]);
  }

  private changeSearchFilter(aggregateModels: AggregateModel[]): void {
    this.aggregateModels$.next(filterAggregates(DEFAULT_SEARCH_FILTER_ITEM, aggregateModels));
  }

  private onPageChanged(): void {
    if (this.hasFilterQueryParams(this.queryParamsService.getCurrentQueryParams())) {
      this.showFilter = true;
    }
  }

  private hasQueryParams(queryParams: {}): boolean {
    return Object.keys(queryParams).length > 1;
  }

  private getSearchAggregates(): void {
    const subscription = this.advanceSearch.requestSearchFilters(this.params).subscribe((aggregateModels: AggregateModel[]) => {
      this.changeSearchFilter(aggregateModels);
    });
    this.subscription.add(subscription);
  }

  private hasFilterQueryParams(queryParams: {}): boolean {
    return Object.keys(queryParams).some((key) => key.includes('_agg'));
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

  private onQueryParamsChanged(): void {
    const subscription = this.queryParamsService.onQueryParamsChanged().pipe(
      filter((queryParams) => !this.submitted && this.hasQueryParams(queryParams)),
    ).subscribe(queryParams => {
      this.setFormValues(queryParams);
      if (this.brandSerice.hasBrand()) {
        this.onSearch();
      }
    });
    this.subscription.add(subscription);
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
    params = selectObjectByKeys(params, ['ecm_fulltext', 'pageSize', 'currentPageIndex', 'aggregates', 'ecm_path']);
    this.patchFormValue(params);
  }
}
