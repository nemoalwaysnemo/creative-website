import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SearchDataSource } from '@pages/shared';

@Component({
  selector: 'tbwa-search-form',
  styleUrls: ['./search-form.component.scss'],
  templateUrl: './search-form.component.html',
})
export class SearchFormComponent implements OnInit, OnDestroy {

  private alive: boolean = true;

  aggregates: {}[] = [];

  searchForm: FormGroup;

  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private searchDataSource: SearchDataSource,
  ) {

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.alive = false;
  }

  private onClear(): void {
  }

  private onReset(): void {

  }

  private onSearch(): void {
    this.submitted = true;

  }
}
