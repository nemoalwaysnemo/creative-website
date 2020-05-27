import { Injectable } from '@angular/core';
import { of as observableOf, Observable, Subject } from 'rxjs';
import { map, filter, share } from 'rxjs/operators';
import { AdvanceSearchService, NuxeoPageProviderParams, NuxeoRequestOptions, SearchResponse } from '@core/api';
import { GoogleAnalyticsService } from '@core/services';

export class GlobalSearchFormEvent {
  [key: string]: any;
  readonly name: string;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}

@Injectable({
  providedIn: 'root',
})
export class GlobalSearchFormService {

  private event: Subject<GlobalSearchFormEvent> = new Subject<GlobalSearchFormEvent>();

  constructor(
    private advanceSearchService: AdvanceSearchService,
    private googleAnalyticsService: GoogleAnalyticsService) {
  }

  advanceSearch(provider: string, searchParams: NuxeoPageProviderParams = new NuxeoPageProviderParams(), opts: NuxeoRequestOptions = new NuxeoRequestOptions(), extra: { [key: string]: any } = {}): Observable<SearchResponse> {
    return this.advanceSearchService.search(provider, searchParams, opts, extra);
  }

  onSearch(): Observable<SearchResponse> {
    return this.advanceSearchService.onSearch();
  }

  onEvent(name?: string): Observable<GlobalSearchFormEvent> {
    return (name ? this.event.pipe(filter((e: GlobalSearchFormEvent) => e.name === name)) : this.event).pipe(share());
  }

  triggerEvent(event: GlobalSearchFormEvent): this {
    this.event.next(event);
    return this;
  }

  changePageIndex(currentPageIndex: number): void {
    this.triggerEvent(new GlobalSearchFormEvent({ name: 'onPageNumberChanged', searchParams: { currentPageIndex }, override: {} }));
  }

  search(searchParams: any = {}, override: any = {}): void {
    this.triggerEvent(new GlobalSearchFormEvent({ name: 'onSearch', searchParams, override }));
  }

  private googleAnalyticsTrackEvent(event: string): void {
    if (['PageInitialized', 'SearchTermChanged', 'FormFilterChanged'].includes(event)) {
      // const queryParams = this.buildQueryParams();
      // this.googleAnalyticsService.trackSearch({ 'event_category': 'Search', 'event_action': event, 'event_label': event, queryParams });
    }
  }

}
