import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, forwardRef, Input, EventEmitter, Output } from '@angular/core';
import { MatChipInputEvent } from '@angular/material';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'tbwa-option-tag',
  templateUrl: 'option-tag.component.html',
  styleUrls: ['option-tag.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OptionTagComponent),
    multi: true,
  }],
})
export class OptionTagComponent implements ControlValueAccessor {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  @Input() placeholder: string;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: string[] = [];
  selectedItems = [];

  private _onChange = (_) => { };

  private _onTouched = () => { };

  options$: Observable<string[]>;

  @Input()
  set items(items: string[]) {
    if (items) {
      this.options$ = new BehaviorSubject(items);
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
    this._onChange(this.tags);
  }

  remove(item: string): void {
    const index = this.tags.indexOf(item);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
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
}
