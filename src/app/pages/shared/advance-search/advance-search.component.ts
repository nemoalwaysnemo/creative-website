import { OnInit, Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { SearchDataSource } from '../services/search-data-source.service';
import { NuxeoPagination, DocumentModel } from '@core/api';

@Component({
  selector: 'tbwa-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.scss'],
})

export class AdvanceSearchComponent implements OnInit, OnDestroy {
  results: DocumentModel[];
  queryField: FormControl = new FormControl();
  layout = 'search-list';
  valueSubscription: Subscription;

  constructor(private dataSource: SearchDataSource) { }

  ngOnInit() {
    this.valueSubscription = this.queryField.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((query: string) => this.dataSource.searchForText(query)),
      )
      .subscribe((result: NuxeoPagination) => {
        this.results = result.entries;
      });
  }

  ngOnDestroy() {
    this.valueSubscription.unsubscribe();
  }
}
