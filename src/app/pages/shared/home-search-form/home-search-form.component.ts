import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of as observableOf } from 'rxjs';
import { DocumentModel, SearchResponse } from '@core/api';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { BaseSearchFormComponent } from '../global-search-form/base-search-form.component';
import { GlobalSearchFormSettings } from '../global-search-form/global-search-form.interface';
import { GlobalSearchFormService } from '../global-search-form/global-search-form.service';

@Component({
  selector: 'home-search-form',
  templateUrl: './home-search-form.component.html',
  styleUrls: ['./home-search-form.component.scss'],
})

export class HomeSearchFormComponent extends BaseSearchFormComponent {

  documents: DocumentModel[] = [];

  backgroudUrl: string = '';

  layout: string = 'suggestion-inline';

  private preventDocHide: boolean = false;

  private isInitialSearch: boolean = true;

  private results: DocumentModel[] = [];

  @Input() headline: string;

  @Input() extraHeadline: string;

  @Input() subHead: string;

  @Input() assetUrl: string;

  @Input() assetUrlMapping: object = {};

  @Input() redirectUrl: string;

  formSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'home-search-form',
  });

  constructor(
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected queryParamsService: SearchQueryParamsService,
    protected globalSearchFormService: GlobalSearchFormService,
  ) {
    super(
      router,
      formBuilder,
      queryParamsService,
      globalSearchFormService,
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

  preventHide(pre: boolean): void {
    this.preventDocHide = pre;
  }

  toggleFilter(): void {
    if (!this.submitted) {
      this.showFilter = !this.showFilter;
    }
    this.preventDocHide = true;
  }

  private matchAssetUrl(doc: DocumentModel): string {
    let url = this.assetUrlMapping[doc.type] ? this.assetUrlMapping[doc.type] : this.assetUrlMapping['*'];
    url = url.replace(':parentRef', doc.parentRef);
    return url;
  }

  private redirectToListPage(queryParams: {}): void {
    this.router.navigate([this.redirectUrl], { queryParamsHandling: 'merge', queryParams });
  }

  protected onAfterSearchEvent(res: SearchResponse): Observable<SearchResponse> {
    if (res.metadata.source === this.formSettings.source) {
      this.results = res.response.entries;
      const searchText = res.searchParams.ecm_fulltext;
      const searchFilter = res.searchParams.hasFilters();
      this.isInitialSearch = !(searchText || searchFilter);
      this.isInitialSearch ? this.hide() : this.show();
    }
    return observableOf(res);
  }
}
