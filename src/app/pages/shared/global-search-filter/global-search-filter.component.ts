import { Component, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { AggregateModel } from '@core/api';
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
export class GlobalSearchFilterComponent implements ControlValueAccessor {

  aggregateModel: any = {};

  optionSettings: OptionSettings[] = [];

  closeOnSelect: boolean = true;

  disabled: boolean = false;

  private _onChange = (_) => { };

  private _onTouched = () => { };

  @Input('aggregateModels')
  set setAggregateModels(models: AggregateModel[]) {
    this.optionSettings = this.buildOptionSettings(models);
  }

  @Output() selected: EventEmitter<any> = new EventEmitter();

  @Output() preventHideDoc: EventEmitter<any> = new EventEmitter();

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

  preventHide() {
    this.preventHideDoc.emit(true);
  }

  private buildOptionSettings(models: AggregateModel[]): OptionSettings[] {
    const settings: OptionSettings[] = [];
    for (const model of models) {
      const options = [];
      const id = model.id;
      const placeholder = model.placeholder;
      const bufferSize = model.bufferSize;
      const iteration = model.iteration;
      for (const bucket of model.extendedBuckets) {
        if (model.filterValueFn && model.filterValueFn.call(this, bucket)) {
          options.push(this.buildOptionModel(bucket, model.optionLabels));
        }
      }
      settings.push(new OptionSettings({ id, placeholder, options, iteration, bufferSize }));
    }
    return settings;
  }

  private buildOptionModel(agg: any = {}, labels: any = {}): OptionModel {
    const aggKey = labels && (labels[agg.label] || labels[agg.key]) ? (labels[agg.label] || labels[agg.key]) : (agg.label || agg.key);
    const label = `${aggKey} (${agg.docCount})`;
    const value = agg.key.replace(/\\/gi, String.fromCharCode(92, 92));
    return new OptionModel({ label, value });
  }
}
