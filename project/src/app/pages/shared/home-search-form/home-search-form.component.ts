import { Component, Input, TemplateRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of as observableOf } from 'rxjs';
import { isValueEmpty, matchAssetUrl } from '@core/services/helpers';
import { DocumentModel, SearchResponse, GlobalSearchParams } from '@core/api';
import { DocumentPageService } from '../services/document-page.service';
import { DocumentThumbnailViewSettings } from '../document-thumbnail-view';
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

  thumbnailViewOptions: any = {
    layout: 'suggestion-inline',
    loadingStyle: {},
  };

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'home-search-form',
  });

  @Input() headline: string;

  @Input() extraHeadline: string;

  @Input() subHead: string;

  @Input() assetUrl: string;

  @Input() searchPageUrl: string;

  @Input() assetUrlMapping: any = {};

  @Input() templateRef: TemplateRef<any>;

  @Input() openSearchFilter: boolean = false;

  @Input()
  set thumbnailViewSettings(settings: any) {
    if (!isValueEmpty(settings)) {
      this.thumbnailViewOptions = new DocumentThumbnailViewSettings(Object.assign({}, this.getDefaultThumbnailViewSettings(), settings));
    }
  }

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
    const params = new GlobalSearchParams(this.getFormValue(), (this.openSearchFilter ? { showFilter: true } : {})).toQueryParams();
    this.redirectToListPage(params);
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  getAssetUrl(doc: DocumentModel): string {
    return this.assetUrl ? this.assetUrl : matchAssetUrl(doc, this.assetUrlMapping);
  }

  protected isSearchManually(res: SearchResponse): boolean {
    return (res.searchParams.hasKeyword() || res.searchParams.hasFilters()) && res.searchParams.event !== 'onSearchParamsInitialized';
  }

  protected redirectToListPage(queryParams: any = {}): void {
    if (this.searchPageUrl) {
      this.router.navigate([this.searchPageUrl], { queryParamsHandling: 'merge', queryParams });
    }
  }

  protected onBeforeSearchEvent(res: SearchResponse): Observable<SearchResponse> {
    this.thumbnailViewOptions = Object.assign({}, this.thumbnailViewOptions, { loadingStyle: this.isSearchManually(res) ? { 'min-height': '60px' } : {} });
    return observableOf(res);
  }

  protected onAfterSearchEvent(res: SearchResponse): Observable<SearchResponse> {
    this.documents = this.isSearchManually(res) ? res.response.entries : [];
    this.show();
    return observableOf(res);
  }

  protected getDefaultThumbnailViewSettings(): any {
    return {
      layout: 'suggestion-inline',
      loadingStyle: {},
      hideEmpty: true,
    };
  }
}
