import { OnInit, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { HomeSearchDataSource } from './home-search-data-source.service';
import { NuxeoPagination } from '@core/api';

@Component({
  selector: 'tbwa-home-search',
  templateUrl: './home-search.component.html',
  styleUrls: ['./home-search.component.scss'],
})

export class HomeSearchComponent implements OnInit {
  results: any[] = [];
  queryField: FormControl = new FormControl();
  constructor(private dataSource: HomeSearchDataSource) {}

  ngOnInit() {
    this.queryField.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((query: string) => this.dataSource.searchForText(query)),
      )
      .subscribe((result: NuxeoPagination) => {
        this.results = [];
        result.entries.forEach(entry => {
          this.results.push({ name: entry.title, url: entry.contextParameters.thumbnail.url, genres: [entry.properties['dc:description']]});
        });
      });
  }
}
