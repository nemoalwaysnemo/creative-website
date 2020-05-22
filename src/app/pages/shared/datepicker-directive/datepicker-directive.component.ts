import { Component, forwardRef, Input, OnInit, AfterViewInit } from '@angular/core';
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
  @Input() readonly: false;

  private _onChange = (_) => { };

  private _onTouched = () => { };

  writeValue(value: any): void {
    if (value !== null) {
      this.value = formatDate(value, 'MMM d, yyyy', 'en-US');
      this.date = new Date(value);
    }
  }

  inputChange(event: any) {
    const date_input = event.target.value;
    if (date_input === '') {
      this._onChange(null);
    } else if (date_input !== this.value) {
      this._onChange(new Date(date_input));
    }
  }

  onChange(event: Date) {
    this._onChange(event);
  }

  onBlur(event: any) {
    if ((this.value && this.value.length < 1) || !this.value) this._onTouched();
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
}
