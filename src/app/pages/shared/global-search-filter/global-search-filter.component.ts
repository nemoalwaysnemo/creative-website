import { Component, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { AggregateModel } from '@core/api';
import { OptionModel } from '../option-select/option-select.interface';

@Component({
  selector: 'tbwa-global-search-filter',
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

  aggregates: AggregateModel[] = [];

  disabled: boolean = false;

  private _onChange = (_) => { };

  private _onTouched = () => { };

  @Input('aggregateModels')
  set setAggregateModels(models: AggregateModel[]) {
    this.aggregates = this.buildAggregates(models);
  }

  @Output() selected: EventEmitter<any> = new EventEmitter();

  @Output() close: EventEmitter<any> = new EventEmitter();

  onChange() {
    this._onChange(this.aggregateModel);
    this.selected.emit(this.aggregateModel);
  }

  onClose() {
    this.close.next(this.aggregateModel);
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

  private buildAggregates(models: AggregateModel[]): any[] {
    const aggregates = [];
    for (const model of models) {
      const options = [];
      const id = model.id;
      const placeholder = model.placeholder;
      for (const bucket of model.extendedBuckets) {
        options.push(this.buildOptionModel(bucket));
      }
      aggregates.push({ id, placeholder, options });
    }
    return aggregates;
  }

  private buildOptionModel(agg: any = {}) {
    const label = `${agg.key} (${agg.docCount})`;
    const value = agg.key;
    const disabled = false;
    return new OptionModel(label, value, disabled);
  }
}
