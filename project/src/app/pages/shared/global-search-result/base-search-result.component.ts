import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Params } from '@angular/router';
import { isValueEmpty } from '@core/services/helpers';
import { SearchResponse, DocumentModel } from '@core/api';
import { Observable, of as observableOf, Subscription } from 'rxjs';
import { DocumentPageService } from '../services/document-page.service';
import { DocumentThumbnailViewSettings } from '../document-thumbnail-view';

@Component({
  template: '',
})
export class BaseSearchResultComponent implements OnInit, OnDestroy {

  currentView: string = 'thumbnailView';

  queryParams: Params = {};

  protected inputThumbnailViewOpts: any = {};

  protected thumbnailViewOpts: DocumentThumbnailViewSettings;

  protected enabledView: any = { thumbnailView: true };

  protected subscription: Subscription = new Subscription();

  @Input()
  set selectedView(name: string) {
    this.performViewTemplate(name);
  }

  @Input()
  set thumbnailViewSettings(settings: any) {
    if (!isValueEmpty(settings)) {
      this.inputThumbnailViewOpts = settings;
    }
  }

  @Input() afterSearch: (res: SearchResponse) => Observable<SearchResponse> = (res: SearchResponse) => observableOf(res);

  constructor(protected documentPageService: DocumentPageService) {

  }

  ngOnInit(): void {
    this.onInit();
  }

  ngOnDestroy(): void {
    this.onDestroy();
  }

  getThumbnailUrl(doc: DocumentModel): string {
    return doc[this.thumbnailViewOptions.thumbnailType];
  }

  isViewEnabled(name: string): boolean {
    return this.enabledView[name];
  }

  get thumbnailViewOptions(): any {
    return this.thumbnailViewOpts ? this.thumbnailViewOpts : new DocumentThumbnailViewSettings(Object.assign({}, this.getDefaultThumbnailViewSettings(), this.inputThumbnailViewOpts));
  }

  protected onInit(): void {

  }

  protected onDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected getDefaultThumbnailViewSettings(): any {
    return {
      layout: 'search-results',
    };
  }

  protected performViewTemplate(name: string): void {
    this.currentView = name;
    if (!this.enabledView[name]) {
      this.enabledView[name] = true;
    }
  }

  protected onQueryParamsChanged(): void {
    const subscription = this.documentPageService.onQueryParamsChanged().subscribe((params: Params) => {
      this.queryParams = params;
    });
    this.subscription.add(subscription);
  }

}
