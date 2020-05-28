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
      const validDateExp = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ([1-9]|[1-2][0-9]|(3)[0-1]), (?:19[7-9]\d|2\d{3})/i;
      (validDateExp.test(date_input)) ? this._onChange(new Date(date_input)) : this._onChange(new Date(''));
    }
  }

  onChange(event: Date) {
    this._onChange(event);
  }

  onBlur(event: any) {
    // if ((this.value && this.value.length < 1) || !this.value) this._onTouched();
    this._onTouched();
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
}
