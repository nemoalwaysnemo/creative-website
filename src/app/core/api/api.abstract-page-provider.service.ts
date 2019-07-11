import { Observable, of as observableOf, Subject } from 'rxjs';
import { share, concat, map, tap } from 'rxjs/operators';
import { AbstractBaseSearchService } from './api.abstract-base-search.service';
import { join } from '../services';
import {
  NuxeoPagination,
  NuxeoPageProviderParams,
  NuxeoRequestOptions,
  AggregateModel,
} from './nuxeo';

export class SearchResponse {
  response: NuxeoPagination;
  readonly queryParams: NuxeoPageProviderParams;
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

  search(queryParams: NuxeoPageProviderParams = new NuxeoPageProviderParams(), opts: NuxeoRequestOptions = new NuxeoRequestOptions()): Observable<SearchResponse> {
    return observableOf(new SearchResponse({ response: new NuxeoPagination(), queryParams, action: 'beforeSearch' })).pipe(
      concat(this.request(queryParams, opts).pipe(map((response: NuxeoPagination) => (new SearchResponse({ response, queryParams, action: 'afterSearch' }))))),
      tap((res: SearchResponse) => this.entries$.next(res)),
      share(),
    );
  }

  request(queryParams?: NuxeoPageProviderParams, opts?: NuxeoRequestOptions, provider: string = this.provider): Observable<NuxeoPagination> {
    const params = this.getRequestParams(queryParams);
    const options = this.getRequestOptions(opts);
    return this.execute(this.getRequestUrl(provider), params, options);
  }

  onSearch(): Observable<SearchResponse> {
    return this.entries$.pipe(share());
  }

  buildAggregateModels(response: NuxeoPagination): AggregateModel[] {
    const aggregations: AggregateModel[] = [];
    const aggs = Object.values(response.aggregations);
    for (const agg of aggs) {
      aggregations.push(new AggregateModel(agg));
    }
    return aggregations;
  }

  protected execute(url: string, queryParams: any = {}, opts: NuxeoRequestOptions): Observable<NuxeoPagination> {
    return this.nuxeoApi.pageProvider(url, queryParams, opts);
  }

}
