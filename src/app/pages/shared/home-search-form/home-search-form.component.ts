import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of as observableOf } from 'rxjs';
import { DocumentModel, SearchResponse } from '@core/api';
import { DocumentPageService } from '../services/document-page.service';
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

  hideView: boolean = false;

  loadingStyle: any = {};

  layout: string = 'suggestion-inline';

  formSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'home-search-form',
  });

  @Input() headline: string;

  @Input() extraHeadline: string;

  @Input() subHead: string;

  @Input() assetUrl: string;

  @Input() assetUrlMapping: any = {};

  @Input() openSearchFilter: boolean = false;

  @Input() redirectUrl: string;

  constructor(
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected documentPageService: DocumentPageService,
    protected globalSearchFormService: GlobalSearchFormService,
  ) {
    super(
      router,
      formBuilder,
      documentPageService,
      globalSearchFormService,
    );
  }

  show(): void {
    this.hideView = false;
  }

  hide(): void {
    this.hideView = true;
  }

  onKeyEnter(event: KeyboardEvent): void {
    const params = this.buildQueryParams(this.openSearchFilter ? { showFilter: true } : {});
    this.redirectToListPage(params);
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  getAssetUrl(doc: DocumentModel): string {
    return this.assetUrl ? this.assetUrl : this.matchAssetUrl(doc);
  }

  protected matchAssetUrl(doc: DocumentModel): string {
    let url = '';
    if (this.assetUrlMapping[doc.type] instanceof Function) {
      url = this.assetUrlMapping[doc.type].call(this, doc);
    } else {
      url = this.assetUrlMapping[doc.type] ? this.assetUrlMapping[doc.type] : this.assetUrlMapping['*'];
    }
    url = url.replace(':parentRef', doc.parentRef);
    return url;
  }

  protected isSearchManually(res: SearchResponse): boolean {
    return (res.searchParams.hasKeyword() || res.searchParams.hasFilters()) && res.metadata.event !== 'onSearchParamsInitialized';
  }

  protected redirectToListPage(queryParams: any = {}): void {
    this.router.navigate([this.redirectUrl], { queryParamsHandling: 'merge', queryParams });
  }

  protected onBeforeSearchEvent(res: SearchResponse): Observable<SearchResponse> {
    this.loadingStyle = this.isSearchManually(res) ? { 'min-height': '100px' } : {};
    return observableOf(res);
  }

  protected onAfterSearchEvent(res: SearchResponse): Observable<SearchResponse> {
    this.documents = this.isSearchManually(res) ? res.response.entries : [];
    this.show();
    return observableOf(res);
  }
}
