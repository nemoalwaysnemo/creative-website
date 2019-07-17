import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { OptionModel, ItemTree } from './option-select.interface';

@Component({
  selector: 'option-select',
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

  options$: BehaviorSubject<OptionModel[]>;

  filter$ = new Subject<string>();

  selectedItems: OptionModel[] = [];

  private _onChange = (_) => { };

  private _onTouched = () => { };

  @Input() iteration: boolean = false;

  @Input()
  set items(items: OptionModel[]) {
    if (items) {
      if (this.iteration) {
        const tree = new ItemTree('/');
        items.forEach(item => {
          tree.addNodes(item.value, item.label);
        });
        tree.plantingTree();
        items = tree.models.length > 0 ? tree.models : items;
      }
      this.options$.next(items);
    }
  }

  @Input() closeOnSelect: boolean = false;

  @Input() placeholder: string;

  @Output() selected: EventEmitter<OptionModel[]> = new EventEmitter();

  constructor() {
    this.options$ = new BehaviorSubject<OptionModel[]>([]);
  }

  onChange(event: OptionModel[]): void {
    if (Array.isArray(event)) {
      this._onChange(event.map(x => x.value));
      this.selected.emit(event);
    }
  }

  onOpen(): void {
  }

  onClose(): void {
  }

  onClear(): void {
  }

  onSearch(event: OptionModel[]): void {
  }

  onFocus(event: FocusEvent): void {
  }

  onBlur(event: FocusEvent): void {
  }

  onAdd(event: OptionModel): void {
  }

  onRemove(event: OptionModel): void {
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
