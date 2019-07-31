import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { DocumentModel, AdvanceSearch, SearchResponse } from '@core/api';
import { GoogleAnalyticsService } from '@core/google-analytics';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { AbstractSearchFormComponent, SearchParams } from '../global-search-form/abstract-search-form.component';

@Component({
  selector: 'home-search-form',
  templateUrl: './home-search-form.component.html',
  styleUrls: ['./home-search-form.component.scss'],
})

export class HomeSearchFormComponent extends AbstractSearchFormComponent {

  documents: DocumentModel[] = [];

  backgroudUrl: string = '';

  layout: string = 'suggestion-inline';

  loading: boolean = false;

  private preventDocHide: boolean = false;

  private isInitialSearch: boolean = true;

  private results: DocumentModel[] = [];

  @Input() headline: string;

  @Input() extraHeadline: string = '';

  @Input() subHead: string;

  @Input() assetUrl: string;

  @Input() assetUrlMapping: object = {};

  @Input() redirectUrl: string;

  @Input() showQuery: boolean = false;

  constructor(
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected advanceSearch: AdvanceSearch,
    protected googleAnalyticsService: GoogleAnalyticsService,
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

  show(): void {
    this.documents = this.isInitialSearch ? this.documents = [] : this.results;
  }

  hide(): void {
    if (!this.preventDocHide) {
      this.documents = [];
    }
    this.preventDocHide = false;
  }

  onKeyEnter(event: KeyboardEvent): void {
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

  private redirectToListPage(queryParams: {}): void {
    this.router.navigate([this.redirectUrl], { queryParamsHandling: 'merge', queryParams });
  }

  toggleFilter(): void {
    if (!this.submitted) {
      this.showFilter = !this.showFilter;
    }
    this.preventDocHide = true;
  }

  protected onSearchPerformed(): void {
    const subscription = this.search$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter((params: SearchParams) => params.params && Object.keys(params.params).length > 0),
      switchMap((params: SearchParams) => this.performSearch(params)),
    ).subscribe((res: SearchResponse) => {
      this.results = res.response.entries;
      const searchText = !!res.searchParams['ecm_fulltext'];
      const searchFilter = Object.keys(res.searchParams).filter((key: string) => key.includes('_agg')).some((agg: string) => !!this.filters[agg]);
      this.isInitialSearch = !(searchText || searchFilter);
      this.isInitialSearch ? this.hide() : this.show();
    });
    this.subscription.add(subscription);
  }
}
