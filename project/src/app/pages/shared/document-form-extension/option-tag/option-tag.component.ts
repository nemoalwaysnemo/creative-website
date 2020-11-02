import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'option-tag',
  templateUrl: 'option-tag.component.html',
  styleUrls: ['option-tag.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OptionTagComponent),
    multi: true,
  }],
})
export class OptionTagComponent implements ControlValueAccessor {

  @Input()
  set items(items: string[]) {
    if (items) {
      this.options$ = new BehaviorSubject(items);
    }
  }

  visible: boolean = true;

  selectable: boolean = true;

  addOnBlur: boolean = true;

  disabled: boolean = false;

  tags: string[] = [];

  @Input() placeholder: string;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  options$: Observable<string[]>;

  private _onChange = (_) => { };

  private _onTouched = () => { };

  onBlur(event: any): void {
    if ((this.tags && this.tags.length < 1) || !this.tags) { this._onTouched(); }
  }

  add(event: any): void {
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
    if (!this.disabled) {
      const index = this.tags.indexOf(item);
      if (index >= 0) {
        this.tags.splice(index, 1);
      }
    }
  }

  writeValue(value: any): void {
    this.tags = (value === null || value === undefined || value === '' ? [] : value);
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
