import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { formatDate } from '@angular/common';
import { NullTemplateVisitor } from '@angular/compiler';

@Component({
  selector: 'datepicker-directive',
  styleUrls: ['./datepicker-directive.component.scss'],
  templateUrl: './datepicker-directive.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatepickerDirectiveComponent),
    multi: true,
  }],
})
export class DatepickerDirectiveComponent implements ControlValueAccessor {
  date: any = '';
  value: any = '';

  @Input() placeholder: string;

  private _onChange = (_) => { };

  private _onTouched = () => { };

  writeValue(value: any): void {
    if (value !== null) {
      this.value = formatDate(value, 'MMM d, yyyy', 'en-US');
      this.date = new Date(value);
    }
  }

  inputChange(event: any) {
    if (event.target.value === '') {
      this._onChange(null);
    }
  }

  onChange(event: Date) {
    this._onChange(event);
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
}