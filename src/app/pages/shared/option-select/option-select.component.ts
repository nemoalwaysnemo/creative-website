import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { OptionModel } from './option-select.interface';

@Component({
  selector: 'tbwa-option-select',
  styleUrls: ['./option-select.component.scss'],
  templateUrl: './option-select.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OptionSelectComponent),
    multi: true,
  }],
})
export class OptionSelectComponent implements ControlValueAccessor {

  disabled: boolean = false;

  loading: boolean = false;

  options$: Observable<OptionModel[]>;

  filter$ = new Subject<string>();

  selectedItems: OptionModel[] = [];

  private _onChange = (_) => { };

  private _onTouched = () => { };

  @Input()
  set items(items: OptionModel[]) {
    if (items) {
      this.options$ = new BehaviorSubject(items);
    }
  }

  @Input() placeholder: string;

  @Output() selected: EventEmitter<OptionModel[]> = new EventEmitter();

  constructor() {
    this.options$ = new BehaviorSubject<OptionModel[]>([]);
  }

  onChange(event: OptionModel[]) {
    if (event.constructor.name === 'Array') {
      this._onChange(event.map(x => x.value));
      this.selected.emit(event);
    }
  }

  onClose(event: OptionModel[]) {
  }

  writeValue(value: any): void {
    this.selectedItems = (value === null || value === undefined || value === '' ? [] : value);
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

}