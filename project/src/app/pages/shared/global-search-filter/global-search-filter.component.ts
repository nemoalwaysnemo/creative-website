import { Component, Input, forwardRef, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { AggregateModel, SearchResponse } from '@core/api';
import { OptionModel, OptionSettings } from '../option-select/option-select.interface';
import { SearchFilterModel } from './global-search-filter.interface';

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

  optionSettings: OptionSettings[] = [];

  closeOnSelect: boolean = true;

  disabled: boolean = false;

  @Input() searchResponse: SearchResponse;

  @Input() aggregateModels: AggregateModel[] = [];

  @Input() filterSettings: SearchFilterModel[] = [];

  @Output() selected: EventEmitter<any> = new EventEmitter<any>();

  private _onChange = (_) => { };

  private _onTouched = () => { };

  ngOnChanges(c: SimpleChanges): void {
    if (this.filterSettings) {
      if (c.aggregateModels && c.aggregateModels.currentValue) {
        this.optionSettings = this.buildAggOptionSettings(this.filterSettings, c.aggregateModels.currentValue);
      } else if (c.searchResponse && c.searchResponse.currentValue) {
        this.optionSettings = this.buildDynamicOptionSettings(this.filterSettings, c.searchResponse.currentValue);
      } else {
        this.optionSettings = this.buildDefaultOptionSettings(this.filterSettings);
      }
    }
  }

  onModelChange(): void {
    this._onChange(this.aggregateModel);
    this.selected.emit(this.aggregateModel);
  }

  onChange(): void {

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

  private buildDefaultOptionSettings(filters: SearchFilterModel[]): OptionSettings[] {
    return (filters || []).map((f: SearchFilterModel) => new OptionSettings({ id: f.key, placeholder: f.placeholder, bufferSize: f.bufferSize }));
  }

  private buildDynamicOptionSettings(filters: SearchFilterModel[] = [], search: SearchResponse): OptionSettings[] {
    const visibleFilters = filters.filter((x: SearchFilterModel) => x.visibleFn(search.searchParams));
    return this.buildAggOptionSettings(visibleFilters, search.response.buildAggregateModels());
  }

  private buildAggOptionSettings(filters: SearchFilterModel[] = [], models: AggregateModel[] = []): OptionSettings[] {
    const settings: OptionSettings[] = [];
    filters.forEach((filter: SearchFilterModel) => {
      if (filter.options) {
        const options = filter.options.map((opt: any) => this.buildOptionModel(opt.label, opt.value));
        settings.push(new OptionSettings({ id: filter.key, placeholder: filter.placeholder, options }));
      } else {
        const agg: AggregateModel = models.find((x: AggregateModel) => x.id === filter.key);
        if (agg) {
          const options = [];
          const id = agg.id;
          const placeholder = filter.placeholder;
          const bufferSize = filter.bufferSize;
          const iteration = filter.iteration;
          for (const bucket of agg.extendedBuckets) {
            if (filter.filterValueFn && filter.filterValueFn(bucket)) {
              options.push(this.buildAggOptionModel(bucket, filter.optionLabels));
            }
          }
          settings.push(new OptionSettings({ id, placeholder, options, iteration, bufferSize }));
        }
      }
    });
    return settings;
  }

  private buildAggOptionModel(agg: any = {}, labels: any = {}): OptionModel {
    const aggKey = labels && (labels[agg.label] || labels[agg.key]) ? (labels[agg.label] || labels[agg.key]) : (agg.label || agg.key);
    const label = agg.docCount > 0 ? `${aggKey} (${agg.docCount})` : aggKey;
    return this.buildOptionModel(label, agg.key);
  }

  private buildOptionModel(label: string, val: any): OptionModel {
    const value = typeof val === 'string' ? val.replace(/\\/gi, String.fromCharCode(92, 92)) : val;
    return new OptionModel({ label, value });
  }
}
