import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdvanceSearch, AggregateModel } from '@core/api';
import { filterParams } from '@core/services';
import { OptionModel } from '@pages/shared';
import { takeWhile, tap, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'tbwa-search-form',
  styleUrls: ['./search-form.component.scss'],
  templateUrl: './search-form.component.html',
})
export class SearchFormComponent implements OnInit, OnDestroy {

  private alive: boolean = true;

  aggregates: any[] = [];

  searchForm: FormGroup;

  submitted: boolean = false;

  private aggList: { [key: string]: string } =
    {
      'assettype_agg': 'Asset Type',
      'agency_agg': 'Agency',
      'country_agg': 'County',
      'brand_agg': 'Brand',
      'clientname_agg': 'Client',
      'industry_agg': 'Industry',
      'campaign_agg': 'Campaign',
      'backslash_category_agg': 'Category',
      'tags_edges_agg': 'Edges',
    };

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
    this.getAggregates();
    this.createForm();
    this.onQueryParamsChanged();
  }

  ngOnDestroy() {
    this.alive = false;
  }

  onSubmit(): void {
    this.onReset();
  }

  private createForm() {
    this.buildFormAggregates();
    const params = Object.assign({}, this.params, this.buildFormAggregates());
    this.searchForm = this.formBuilder.group(params);
  }

  private getFormValue(): object {
    const formValue = {};
    const value = filterParams(this.searchForm.value);
    const keys = Object.keys(value);
    for (const key of keys) {
      if (key.includes('_agg')) {
        formValue[key] = `["${value[key].join('", "')}"]`;
      } else {
        formValue[key] = value[key];
      }
    }
    return formValue;
  }

  private onQueryParamsChanged(): void {
    this.activatedRoute.queryParams
      .pipe(
        takeWhile(() => this.alive),
        distinctUntilChanged(),
      )
      .subscribe(queryParams => {
        if (Object.keys(queryParams).length > 0) {
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
    // const keys = Object.keys(queryParams);
    // for (const key of keys) {

    // }
  }

  private onClear(): void {
  }

  private onReset(): void {
    this.searchForm.patchValue({ currentPageIndex: 0 }, { emitEvent: false });
    this.onSearch();
  }

  private onSearch(): void {
    this.submitted = true;
    this.advanceSearch.search(this.getFormValue());
  }

  private buildFormAggregates(): any {
    const formAggs = {};
    const aggs = Object.keys(this.aggList);
    for (const agg of aggs) {
      formAggs[agg] = null;
    }
    return formAggs;
  }

  private getAggregates(): void {
    this.advanceSearch.requestSearchFilters(this.params).subscribe((aggregates: AggregateModel[]) => {
      for (const agg of aggregates) {
        if (this.aggList[agg.id]) {
          const options = [];
          const id = agg.id;
          const name = this.aggList[agg.id];
          for (const bucket of agg.extendedBuckets) {
            options.push(this.newOptionModel(bucket));
          }
          this.aggregates.push({ id, name, options });
        }
      }
    });
  }

  private newOptionModel(agg: any = {}) {
    const label = `${agg.key} (${agg.docCount})`;
    const value = agg.key;
    const disabled = false;
    return new OptionModel(label, value, disabled);
  }
}
