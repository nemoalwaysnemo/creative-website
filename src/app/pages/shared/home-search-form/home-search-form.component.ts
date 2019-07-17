import { OnInit, Component, OnDestroy, Input } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { DocumentModel, AdvanceSearch } from '@core/api';
import { GoogleAnalyticsService } from '@core/google-analytics';
import { NbLayoutScrollService } from '@core/nebular/theme/services/scroll.service.ts';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { AbstractSearchFormComponent } from '../global-search-form/abstract-search-form.component';

class SearchParams {
  readonly params: { [k: string]: any } = {};
  readonly event: string;
  constructor(params: any = {}, event: string) {
    this.params = params;
    this.event = event;
  }
}

@Component({
  selector: 'home-search-form',
  templateUrl: './home-search-form.component.html',
  styleUrls: ['./home-search-form.component.scss'],
})

export class HomeSearchFormComponent extends AbstractSearchFormComponent implements OnInit, OnDestroy {

  results: DocumentModel[];
  documents: DocumentModel[] = [];
  queryField: FormControl = new FormControl();
  backgroudUrl: string = '';
  layout: string = 'suggestion-inline';
  loading: boolean = false;
  searchParams: any = {};

  params: any = {
    currentPageIndex: 0,
    pageSize: 20,
    ecm_fulltext: '',
    aggregates: {},
  };

  forceStopScoll: boolean = false;
  preventDocHide: boolean = false;
  isInitialSearch: boolean = true;


  @Input() headline: string;
  @Input() extraHeadline: string = '';
  @Input() subHead: string;

  @Input() assetUrl: string;
  @Input() assetUrlMapping: object = {};
  @Input() redirectUrl: string;

  @Input() showQuery: boolean = true;

  @Input() showInput: boolean = true;

  constructor(
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected advanceSearch: AdvanceSearch,
    protected googleAnalyticsService: GoogleAnalyticsService,
    protected scrollService: NbLayoutScrollService,
    protected queryParamsService: SearchQueryParamsService,
    protected activatedRoute: ActivatedRoute,
  ) {
    super(
      router,
      formBuilder,
      advanceSearch,
      activatedRoute,
      queryParamsService,
      googleAnalyticsService,
    );
  }

  ngOnInit() {
    this.createForm();
    this.buildSearchFilter([]);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  show(): void {
    this.documents = this.isInitialSearch ? this.documents = [] : this.results;
    if (this.documents && this.documents.length > 0) {
      this.stopSectionScroll();
    }
  }

  hide(): void {
    if (!this.forceStopScoll) {
      this.startSectionScroll();
    }
    if (!this.preventDocHide) {
      this.documents = [];
    }
    this.forceStopScoll = false;
    this.preventDocHide = false;
  }

  onKeyenter(event: KeyboardEvent): void {
    const params = this.buildQueryParams();
    this.redirectToListPage(params);
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  getAssetUrl(doc: DocumentModel): string {
    return this.assetUrl ? this.assetUrl : this.matchAssetUrl(doc);
  }

  preventHide(pre: boolean) {
    this.preventDocHide = pre;
  }

  private matchAssetUrl(doc: DocumentModel): string {
    return this.assetUrlMapping[doc.type] ? this.assetUrlMapping[doc.type] : this.assetUrlMapping['*'];
  }

  private buildQueryParams(): any {
    return { q: this.queryField.value };
  }

  private createForm(): void {
    this.searchForm = this.formBuilder.group(this.params);
  }

  private redirectToListPage(queryParams: {}): void {
    this.router.navigate([this.redirectUrl], { queryParamsHandling: 'merge', queryParams });
  }

  private stopSectionScroll() {
    this.scrollService.runSectionScroll(false);
  }

  private startSectionScroll() {
    this.scrollService.runSectionScroll(true);
  }

  toggleFilter(): void {
    if (!this.submitted) {
      this.showFilter = !this.showFilter;
    }
    if (this.showFilter) {
      this.stopSectionScroll();
      this.forceStopScoll = true;
    }
    this.preventDocHide = true;
  }

  protected onSearchPerformed(): void {
    const subscription = this.search$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter((params: SearchParams) => params.params && Object.keys(params.params).length > 0),
      switchMap((params: SearchParams) => this.performSearch(params)),
    ).subscribe((res) => {
      console.info(res);
      let searchFilter = false;
      if (res.response.entries.length > 0) {
        this.stopSectionScroll();
      }
      this.results = res.response.entries;
      const searchText = !!res.queryParams['ecm_fulltext'];
      for (const key in res.queryParams) {
        if (key in this.filters) {
          searchFilter = true;
        }
      }
      this.isInitialSearch = !(searchText || searchFilter);
      this.isInitialSearch ? this.hide() : this.show();
    });
    this.subscription.add(subscription);
  }
}
