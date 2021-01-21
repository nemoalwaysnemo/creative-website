import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, forwardRef, HostBinding, Input, Output } from '@angular/core';
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

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @HostBinding('class.is-empty')
  get isEmpty(): boolean {
    return !this.tags || this.tags.length === 0;
  }

  @Input()
  set items(items: string[]) {
    if (items) {
      this.options$ = new BehaviorSubject(items);
    }
  }

  @Input() placeholder: string;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();

  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  visible: boolean = true;

  selectable: boolean = true;

  addOnBlur: boolean = true;

  disabled: boolean = false;

  tags: string[] = [];

  options$: Observable<string[]>;

  private _onChange = (_) => { };

  private _onTouched = () => { };

  onBlur(event: any): void {
    if ((this.tags && this.tags.length < 1) || !this.tags) { this._onTouched(); }
    this.blur.emit(event);
  }

  onFocus(event: any): void {
    this.focus.emit(event);
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
