import { Component, Input, forwardRef, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { AggregateModel, SearchFilterModel } from '@core/api';
import { OptionModel, OptionSettings } from '../option-select/option-select.interface';

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

  private _onChange = (_) => { };

  private _onTouched = () => { };

  @Input() aggregateModels: AggregateModel[] = [];

  @Input() filterSettings: SearchFilterModel[] = [];

  @Output() selected: EventEmitter<any> = new EventEmitter();

  @Output() preventHideDoc: EventEmitter<any> = new EventEmitter();

  ngOnChanges(c: SimpleChanges) {
    if (c.filterSettings && c.aggregateModels) {
      this.optionSettings = this.buildAggOptionSettings(c.filterSettings.currentValue, c.aggregateModels.currentValue);
    } else if (c.filterSettings) {
      this.optionSettings = this.buildDefaultOptionSettings(c.filterSettings.currentValue);
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

  preventHide(): void {
    this.preventHideDoc.emit(true);
  }

  private buildDefaultOptionSettings(filters: SearchFilterModel[]): OptionSettings[] {
    return (filters || []).map((f: SearchFilterModel) => new OptionSettings({ id: f.key, placeholder: f.placeholder, bufferSize: f.bufferSize }));
  }

  private buildAggOptionSettings(filters: SearchFilterModel[] = [], models: AggregateModel[] = []): OptionSettings[] {
    const settings: OptionSettings[] = [];
    filters.forEach((filter: SearchFilterModel) => {
      const agg: AggregateModel = models.find((x: AggregateModel) => x.id === filter.key);
      if (agg) {
        const options = [];
        const id = agg.id;
        const placeholder = filter.placeholder;
        const bufferSize = filter.bufferSize;
        const iteration = filter.iteration;
        for (const bucket of agg.extendedBuckets) {
          if (filter.filterValueFn && filter.filterValueFn.call(this, bucket)) {
            options.push(this.buildOptionModel(bucket, filter.optionLabels));
          }
        }
        settings.push(new OptionSettings({ id, placeholder, options, iteration, bufferSize }));
      }
    });
    return settings;
  }

  private buildOptionModel(agg: any = {}, labels: any = {}): OptionModel {
    const aggKey = labels && (labels[agg.label] || labels[agg.key]) ? (labels[agg.label] || labels[agg.key]) : (agg.label || agg.key);
    const label = `${aggKey} (${agg.docCount})`;
    const value = agg.key.replace(/\\/gi, String.fromCharCode(92, 92));
    return new OptionModel({ label, value });
  }
}
