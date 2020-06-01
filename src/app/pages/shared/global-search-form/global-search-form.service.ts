import { Injectable } from '@angular/core';
import { of as observableOf, Observable, Subject } from 'rxjs';
import { map, filter, share } from 'rxjs/operators';
import { AdvanceSearchService, NuxeoPageProviderParams, NuxeoRequestOptions, SearchResponse, NuxeoPagination } from '@core/api';
import { GoogleAnalyticsService } from '@core/services';

export class GlobalSearchFormEvent {
  [key: string]: any;
  readonly metadata: any = {};
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

  request(searchParams: NuxeoPageProviderParams, opts?: NuxeoRequestOptions, provider?: string): Observable<NuxeoPagination> {
    return this.advanceSearchService.request(searchParams, opts, provider);
  }

  advanceSearch(provider: string, searchParams: NuxeoPageProviderParams = new NuxeoPageProviderParams(), opts: NuxeoRequestOptions = new NuxeoRequestOptions(), metadata: any = {}): Observable<SearchResponse> {
    // this.googleAnalyticsTrackEvent();
    return this.advanceSearchService.search(provider, searchParams, opts, metadata);
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


  changePageIndex(currentPageIndex: number, pageSize: number = 20, metadata: any = {}): void {
    this.triggerEvent(new GlobalSearchFormEvent({ name: 'onPageNumberChanged', searchParams: { currentPageIndex, pageSize }, metadata }));
  }

  search(searchParams: any = {}, metadata: any = {}): void {
    this.triggerEvent(new GlobalSearchFormEvent({ name: 'onSearchParamsChanged', searchParams, metadata }));
  }

  private googleAnalyticsTrackEvent(event: string): void {
      // const queryParams = this.buildQueryParams();
      // this.googleAnalyticsService.trackSearch({ 'event_category': 'Search', 'event_action': event, 'event_label': event, queryParams });
  }

}
