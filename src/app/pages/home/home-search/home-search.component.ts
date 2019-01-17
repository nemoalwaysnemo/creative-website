import { OnInit, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Subscription, BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { NuxeoPagination, DocumentModel, AdvanceSearch, AggregateModel, filterAggregates } from '@core/api';
import { DEFAULT_SEARCH_FILTER_ITEM, SearchQueryParamsService } from '@pages/shared';
import { deepExtend } from '@core/services';

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

  aggregateModels$ = new BehaviorSubject<AggregateModel[]>([]);
  searchForm: FormGroup;
  submitted: boolean = false;
  showFilter: boolean = false;
  private previouSearchTerm: string;

  private params: any = {
    pageSize: 10,
    ecm_primaryType: '["App-Library-Video", "App-Library-Image"]',
  };

  constructor(
    private formBuilder: FormBuilder,
    private advanceSearch: AdvanceSearch,
    private queryParamsService: SearchQueryParamsService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.createForm();
    this.getSearchAggregates();
    this.search();
    this.onSearch();
    this.onSearchResponse();
  }

  ngOnDestroy() {
    this.alive = false;
    this.queryRef.unsubscribe();
  }

  search(): void {
    this.queryRef = this.queryField.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
    ).subscribe((query: string) => {
      this.advanceSearch.search(deepExtend({}, { ecm_fulltext: query }, this.buildSearchParams()));
    });
  }

  private onSearch(): void {
    this.advanceSearch.onSearch()
      .pipe(
        map((result: any) => result.response),
      )
    .subscribe((response: NuxeoPagination) => {
      this.results = response.entries;
      this.show();
    });
  }

  private onSearchResponse(): void {
    this.advanceSearch.onSearch().pipe(
      map(({ response, queryParams }) => {
        return { aggregateModels: this.advanceSearch.buildAggregateModels(response), queryParams };
      }),
    ).subscribe(({ aggregateModels, queryParams }) => {
      if (queryParams.ecm_fulltext === undefined || this.previouSearchTerm !== queryParams.ecm_fulltext) {
        this.previouSearchTerm = queryParams.ecm_fulltext;
        this.advanceSearch.requestIDsOfAggregates(aggregateModels).subscribe((models: AggregateModel[]) => {
          this.changeSearchFilter(models);
        });
      }
      this.submitted = false;
    });
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
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

  private buildQueryParams(): any {
    return deepExtend({ q: this.queryField.value }, this.queryParamsService.buildQueryParams(this.searchForm.value));
  }

  private createForm() {
    const params = Object.assign({ aggregates: {} }, this.params);
    this.searchForm = this.formBuilder.group(params);
  }

  private buildSearchParams(): object {
    return this.queryParamsService.buildSearchParams(this.searchForm.value);
  }

  private redirectToListPage(queryParams: {}) {
    this.router.navigate(['/p/search'], { queryParamsHandling: 'merge', queryParams });
  }


  private getSearchAggregates(): void {
    this.advanceSearch.requestSearchFilters(this.params).subscribe((aggregateModels: AggregateModel[]) => {
      this.changeSearchFilter(aggregateModels);
    });
  }

  private changeSearchFilter(aggregateModels: AggregateModel[]): void {
    this.aggregateModels$.next(filterAggregates(DEFAULT_SEARCH_FILTER_ITEM, aggregateModels));
  }
}
