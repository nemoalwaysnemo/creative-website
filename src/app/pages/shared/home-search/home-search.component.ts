import { OnInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { HomeSearchDataSource } from './home-search-data-source.service';
import { NuxeoPagination, DocumentModel } from '@core/api';

@Component({
  selector: 'tbwa-home-search',
  templateUrl: './home-search.component.html',
  styleUrls: ['./home-search.component.scss'],
})

export class HomeSearchComponent implements OnInit {
  results: DocumentModel[];
  queryField: FormControl = new FormControl();
  layout = 'search-list';
  constructor(private dataSource: HomeSearchDataSource) { }

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
