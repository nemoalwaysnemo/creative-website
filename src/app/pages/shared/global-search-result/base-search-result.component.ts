import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { SearchResponse, DocumentModel } from '@core/api';
import { Observable, of as observableOf, Subscription } from 'rxjs';
import { DocumentPageService } from '../services/document-page.service';
import { Params } from '@angular/router';

@Component({
  template: '',
})
export class BaseSearchResultComponent implements OnInit, OnDestroy {

  currentView: string = 'thumbnailView';

  queryParams: Params = {};

  protected subscription: Subscription = new Subscription();

  @Input()
  set selectedView(name: string) {
    this.currentView = name;
  }

  @Input() thumbnailType: 'attachedImage' | 'thumbnailUrl' = 'thumbnailUrl';

  @Input() afterSearch: Function = (res: SearchResponse): Observable<SearchResponse> => observableOf(res);

  constructor(protected documentPageService: DocumentPageService) {

  }

  ngOnInit(): void {
    this.onInit();
  }

  ngOnDestroy(): void {
    this.onDestroy();
  }

  getThumbnailUrl(doc: DocumentModel): string {
    return doc[this.thumbnailType];
  }

  protected onInit(): void {

  }

  protected onDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected onQueryParamsChanged(): void {
    const subscription = this.documentPageService.onQueryParamsChanged().subscribe((params: Params) => {
      this.queryParams = params;
    });
    this.subscription.add(subscription);
  }

}
