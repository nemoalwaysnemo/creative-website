import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, share } from 'rxjs/operators';
import { AdvanceSearchService, GlobalSearchParams, NuxeoRequestOptions, SearchResponse, NuxeoPagination } from '@core/api';
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

  advanceRequest(searchParams: GlobalSearchParams, opts?: NuxeoRequestOptions, provider?: string): Observable<NuxeoPagination> {
    return this.advanceSearchService.request(searchParams, opts, provider);
  }

  advanceSearch(provider: string, searchParams: GlobalSearchParams = new GlobalSearchParams(), opts: NuxeoRequestOptions = new NuxeoRequestOptions()): Observable<SearchResponse> {
    this.googleAnalyticsTrackEvent(searchParams);
    return provider === 'RemoteSearch' ? this.advanceSearchService.remoteSearch(searchParams, opts) : this.advanceSearchService.providerSearch(provider, searchParams, opts);
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

  changePageIndex(currentPageIndex: number, pageSize: number = 24, settings: any = {}): void {
    this.triggerEvent(new GlobalSearchFormEvent({ name: 'onPageNumberChanged', searchParams: { currentPageIndex, pageSize }, settings }));
  }

  search(searchParams: any = {}, settings: any = {}): void {
    this.triggerEvent(new GlobalSearchFormEvent({ name: 'onSearchParamsChanged', searchParams, settings }));
  }

  private googleAnalyticsTrackEvent(searchParams: GlobalSearchParams): void {
    if (['onKeywordChanged', 'onFilterChanged'].includes(searchParams.event)) {
      this.googleAnalyticsService.trackSearch({
        event_category: 'Search',
        event_action: `Search - ${searchParams.event}`,
        event_label: `Search - ${searchParams.event}`,
        queryParams: searchParams.toQueryParams(),
      });
    }
  }

}
