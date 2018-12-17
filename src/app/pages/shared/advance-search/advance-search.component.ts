import { OnInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { AdvanceSearchDataSource } from './advance-search-data-source.service';
import { NuxeoPagination, DocumentModel } from '@core/api';

@Component({
  selector: 'tbwa-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.scss'],
})

export class AdvanceSearchComponent implements OnInit {
  results: DocumentModel[];
  queryField: FormControl = new FormControl();
  layout = 'search-list';
  constructor(private dataSource: AdvanceSearchDataSource) { }

  ngOnInit() {
    this.queryField.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((query: string) => this.dataSource.searchForText(query)),
      )
      .subscribe((result: NuxeoPagination) => {
        this.results = result.entries;
      });
  }
}
