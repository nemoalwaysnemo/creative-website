import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { DefaultFilterComponent } from './default-filter';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'checkbox-filter',
  template: `
    <input type="checkbox" [formControl]="inputControl" [ngClass]="inputClass" class="form-control">
    <a href="#" *ngIf="filterActive"
                (click)="resetFilter($event)">{{column.getFilterConfig()?.resetText || 'reset'}}</a>
  `,
})
export class CheckboxFilterComponent extends DefaultFilterComponent implements OnInit {

  filterActive: boolean = false;
  inputControl = new FormControl();

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.changesSubscription = this.inputControl.valueChanges
      .pipe(debounceTime(this.delay))
      .subscribe((checked: boolean) => {
        this.filterActive = true;
        const trueVal = (this.column.getFilterConfig() && this.column.getFilterConfig().true) || true;
        const falseVal = (this.column.getFilterConfig() && this.column.getFilterConfig().false) || false;
        this.query = checked ? trueVal : falseVal;
        this.setFilter();
      });
  }

  resetFilter(event: any) {
    event.preventDefault();
    this.query = '';
    this.inputControl.setValue(false, { emitEvent: false });
    this.filterActive = false;
    this.setFilter();
  }
}
