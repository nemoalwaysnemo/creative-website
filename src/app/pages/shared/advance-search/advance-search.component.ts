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
  documents: DocumentModel[] = [];
  queryField: FormControl = new FormControl();
  layout = 'search-list';
  private valueSubscription: Subscription;

  private params: any = {
    pageSize: 10,
    ecm_primaryType: '["App-Library-Video", "App-Library-Image"]',
  };

  constructor(private dataSource: SearchDataSource) { }

  ngOnInit() {
    this.valueSubscription = this.queryField.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query: string) => this.dataSource.searchForText(query, this.params)),
      )
      .subscribe((result: NuxeoPagination) => {
        this.results = result.entries;
        this.show();
      });
  }

  show(): void {
    this.documents = this.results;
  }

  hide(): void {
    this.documents = [];
  }

  ngOnDestroy() {
    this.valueSubscription.unsubscribe();
  }
}
