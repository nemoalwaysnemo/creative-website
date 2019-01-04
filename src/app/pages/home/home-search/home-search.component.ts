import { OnInit, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { NuxeoPagination, DocumentModel, AdvanceSearch } from '@core/api';

@Component({
  selector: 'tbwa-home-search',
  templateUrl: './home-search.component.html',
  styleUrls: ['./home-search.component.scss'],
})

export class HomeSearchComponent implements OnInit, OnDestroy {

  results: DocumentModel[];
  documents: DocumentModel[] = [];
  queryField: FormControl = new FormControl();
  layout = 'search-list';
  private alive: boolean = true;
  private queryRef: Subscription;

  private params: any = {
    pageSize: 10,
    ecm_primaryType: '["App-Library-Video", "App-Library-Image"]',
  };

  constructor(private advanceSearch: AdvanceSearch, private router: Router) { }

  ngOnInit() {
    this.search();
  }

  search(): void {
    this.queryRef = this.queryField.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query: string) => this.advanceSearch.searchForText(query, this.params)),
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

  onKeyup(event: KeyboardEvent) {
    if (this.alive) {
      const params = this.buildQueryParams();
      this.redirectToListPage(params);
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  private buildQueryParams(): {} {
    return { q: this.queryField.value };
  }

  private redirectToListPage(queryParams: {}) {
    this.router.navigate(['/p/search'], { queryParamsHandling: 'merge', queryParams });
  }

  ngOnDestroy() {
    this.alive = false;
    this.queryRef.unsubscribe();
  }
}
