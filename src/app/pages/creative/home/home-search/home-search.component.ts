import { OnInit, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { NuxeoPagination, DocumentModel, AdvanceSearch, AggregateModel, filterAggregates } from '@core/api';
import { DEFAULT_SEARCH_FILTER_ITEM, SearchQueryParamsService } from '../../shared';
import { Router } from '@angular/router';
import { deepExtend } from '@core/services';
import { NUXEO_META_INFO } from '@environment/environment';

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

  private inputObs: Observable<any>;
  private filterObs: Observable<any>;
  private subscription: Subscription = new Subscription();

  aggregateModels$ = new BehaviorSubject<AggregateModel[]>([]);
  searchForm: FormGroup;
  submitted: boolean = false;
  showFilter: boolean = false;
  private previouSearchTerm: string;

  private params: any = {
    pageSize: 10,
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
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
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  search(): void {
    const subscription = this.queryField.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query: string) => this.advanceSearch.searchForText(query, this.params)),
    )
      .subscribe((result: NuxeoPagination) => {
        this.results = result.entries;
        this.show();
      });
    this.subscription.add(subscription);
  }

  private onSearchResponse(): void {
    const subscription = this.advanceSearch.onSearch().pipe(
      map(({ response, queryParams }) => {
        return { aggregateModels: this.advanceSearch.buildAggregateModels(response), queryParams };
      }),
    ).subscribe(({ aggregateModels, queryParams }) => {
      if (queryParams.ecm_fulltext === undefined || this.previouSearchTerm !== queryParams.ecm_fulltext) {
        this.previouSearchTerm = queryParams.ecm_fulltext;
        const subscription1 = this.advanceSearch.requestIDsOfAggregates(aggregateModels).subscribe((models: AggregateModel[]) => {
          this.changeSearchFilter(models);
        });
        this.subscription.add(subscription1);
      }
      this.submitted = false;
    });
    this.subscription.add(subscription);
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
    const params = this.buildQueryParams();
    this.redirectToListPage(params);
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  goToSearch(): void {
    const params = this.buildQueryParams();
    this.redirectToListPage(params);
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
    const subscription = this.advanceSearch.requestSearchFilters(this.params).subscribe((aggregateModels: AggregateModel[]) => {
      this.changeSearchFilter(aggregateModels);
    });
    this.subscription.add(subscription);
  }

  private changeSearchFilter(aggregateModels: AggregateModel[]): void {
    this.aggregateModels$.next(filterAggregates(DEFAULT_SEARCH_FILTER_ITEM, aggregateModels));
  }
}
