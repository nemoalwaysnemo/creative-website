import { Observable, of as observableOf, Subject } from 'rxjs';
import { share, concat, map, tap } from 'rxjs/operators';
import { AbstractBaseSearchService } from './api.abstract-base-search.service';
import { join } from '../services/helpers';
import {
  NuxeoPagination,
  NuxeoPageProviderParams,
  NuxeoRequestOptions,
} from './nuxeo';

export class SearchResponse {
  response: NuxeoPagination;
  readonly searchParams: NuxeoPageProviderParams;
  readonly extra: { [key: string]: any } = {};
  readonly action: string;
  constructor(response: any = {}) {
    Object.assign(this, response);
  }
}

export abstract class AbstractPageProvider extends AbstractBaseSearchService {

  protected endPoint: string = 'search';

  protected provider: string = 'creative_website_search';

  protected entries$ = new Subject<SearchResponse>();

  protected getRequestUrl(provider?: string): string {
    return join(this.endPoint, 'pp', (provider || this.provider), 'execute');
  }

  search(provider: string, searchParams: NuxeoPageProviderParams = new NuxeoPageProviderParams(), opts: NuxeoRequestOptions = new NuxeoRequestOptions(), extra: { [key: string]: any } = {}): Observable<SearchResponse> {
    return observableOf(new SearchResponse({ response: new NuxeoPagination(), searchParams, extra, action: 'beforeSearch' })).pipe(
      concat(this.request(searchParams, opts, provider).pipe(map((response: NuxeoPagination) => (new SearchResponse({ response, searchParams, extra, action: 'afterSearch' }))))),
      tap((res: SearchResponse) => this.entries$.next(res)),
      share(),
    );
  }

  request(searchParams?: NuxeoPageProviderParams, opts?: NuxeoRequestOptions, provider: string = this.provider): Observable<NuxeoPagination> {
    const params = this.getRequestParams(searchParams);
    const options = this.getRequestOptions(opts);
    return this.execute(this.getRequestUrl(provider), params, options);
  }

  onSearch(): Observable<SearchResponse> {
    return this.entries$.pipe(share());
  }

  protected execute(url: string, queryParams: any = {}, opts: NuxeoRequestOptions): Observable<NuxeoPagination> {
    return this.nuxeoApi.pageProvider(url, queryParams, opts);
  }

}
