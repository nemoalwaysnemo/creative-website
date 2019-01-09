import { Component, Input, OnInit, OnDestroy, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { AggregateModel } from '@core/api';
import { OptionModel } from '../option-select/option-select.interface';

@Component({
  selector: 'tbwa-search-filter',
  styleUrls: ['./search-filter.component.scss'],
  templateUrl: './search-filter.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SearchFilterComponent),
    multi: true,
  }],
})
export class SearchFilterComponent implements OnInit, OnDestroy, ControlValueAccessor {

  private alive: boolean = true;

  aggregateModel: any = {};

  aggregates: AggregateModel[] = [];

  private disabled: boolean = false;

  private _onChange = (_) => { };

  private _onTouched = () => { };

  @Input('aggregateModels')
  set setAggregateModels(models: AggregateModel[]) {
    this.aggregates = this.buildAggregates(models);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.alive = false;
  }

  onChange() {
    this._onChange(this.aggregateModel);
  }

  writeValue(value: any): void {
    // TODO: apply aggregates from outside form
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
