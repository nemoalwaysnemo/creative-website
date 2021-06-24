import { formatDate } from '@angular/common';
import { Component, Input, forwardRef, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { AggregateModel, SearchResponse } from '@core/api';
import { escapeValue } from '@core/services/helpers';
import { OptionModel, OptionSettings } from '../option-select/option-select.interface';
import { SearchConditionModel, SearchDateRangeModel, SearchFilterModel } from './global-search-filter.interface';

@Component({
  selector: 'global-search-filter',
  styleUrls: ['./global-search-filter.component.scss'],
  templateUrl: './global-search-filter.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => GlobalSearchFilterComponent),
    multi: true,
  }],
})
export class GlobalSearchFilterComponent implements ControlValueAccessor, OnChanges {

  aggregateModel: any = {};

  searchOptions: any[] = [];

  closeOnSelect: boolean = true;

  disabled: boolean = false;

  @Input() searchResponse: SearchResponse;

  @Input() filterSettings: SearchConditionModel[] = [];

  @Output() selected: EventEmitter<any> = new EventEmitter<any>();

  private _onChange = (_) => { };

  private _onTouched = () => { };

  ngOnChanges(c: SimpleChanges): void {
    if (this.filterSettings && this.filterSettings.length > 0) {
      if (c.searchResponse && c.searchResponse.currentValue) {
        this.searchOptions = this.buildDynamicSearchOptions(this.filterSettings, c.searchResponse.currentValue);
      } else {
        this.searchOptions = this.buildDefaultSearchOptions(this.filterSettings);
      }
    }
  }

  onModelChange(): void {
    this._onChange(this.aggregateModel);
    this.selected.emit(this.aggregateModel);
  }

  onFilterChange(): void {

  }

  writeValue(value: any): void {
    if (value) {
      this.aggregateModel = value;
    }
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onDateRangeChange(range: { start: Date, end?: Date }, model: SearchDateRangeModel): void {
    this.aggregateModel[model.minKey] = formatDate(range.start, 'yyyy-MM-dd', 'en-US');
    if (range.end) {
      // endDate = new Date(new Date());
      // endDate.setDate(endDate.getDate() + 1);
      // endDate.setHours(0, 0, 0, 0);
      this.aggregateModel[model.maxKey] = formatDate(range.end, 'yyyy-MM-dd', 'en-US');
      this.onModelChange();
    }
  }

  private buildDefaultSearchOptions(filters: SearchConditionModel[]): any[] {
    return (filters || []).map((model: SearchConditionModel) => {
      if (model.type === 'search-filter') {
        const f = model as SearchFilterModel;
        return new OptionSettings({ id: f.key, placeholder: f.placeholder, bufferSize: f.bufferSize, type: f.type });
      } else if (model.type === 'date-range') {
        return model;
      }
    });
  }

  private buildDynamicSearchOptions(filters: SearchConditionModel[] = [], search: SearchResponse): any[] {
    const visibleFilters = filters.filter((x: SearchFilterModel) => x.visibleFn(search.searchParams));
    return visibleFilters.map((model: SearchConditionModel) => {
      if (model.type === 'search-filter') {
        return this.buildAggOptionSettings(model as SearchFilterModel, search.response.buildAggregateModels());
      } else if (model.type === 'date-range') {
        return model;
      }
    });
  }

  private buildAggOptionSettings(m: SearchFilterModel, models: AggregateModel[] = []): OptionSettings {
    let settings: OptionSettings = null;
    if (m.options) {
      const options = m.options.map((opt: any) => new OptionModel({ label: opt.label, value: escapeValue(opt.value) }));
      settings = new OptionSettings({ id: m.key, placeholder: m.placeholder, type: m.type, options });
    } else {
      const agg: AggregateModel = models.find((x: AggregateModel) => x.id === m.key);
      if (agg) {
        const options = [];
        const bufferSize = m.bufferSize;
        const iteration = m.iteration;
        for (const bucket of agg.extendedBuckets) {
          if (m.filterValueFn && m.filterValueFn(bucket)) {
            bucket.value = escapeValue(bucket.key);
            options.push(m.buildAggOptionModel(bucket));
          }
        }
        settings = new OptionSettings({ id: agg.id, placeholder: m.placeholder, options, iteration, bufferSize, type: m.type });
      } else {
        settings = new OptionSettings({ id: m.key, placeholder: m.placeholder, type: m.type });
      }
    }
    return settings;
  }
}
