import { Observable, Subject } from 'rxjs';
import { share } from 'rxjs/operators';
import { AbstractBaseService } from './api.abstract-base.service';

import {
  NuxeoPagination,
  NuxeoPageProviderParams,
  NuxeoRequestOptions,
  AggregateModel,
  join,
} from './nuxeo';

export abstract class AbstractPageProvider extends AbstractBaseService {

  protected endPoint: string = 'search';

  protected provider: string = 'creative_website_search';

  protected entries$ = new Subject<{ response: NuxeoPagination, queryParams: NuxeoPageProviderParams, opts: NuxeoRequestOptions }>();

  protected getRequestUrl(): string {
    return join(this.endPoint, 'pp', this.provider, 'execute');
  }

  search(queryParams: NuxeoPageProviderParams = {}, opts: NuxeoRequestOptions = {}): void {
    this.request(queryParams, opts).subscribe((response: NuxeoPagination) => {
      this.entries$.next({ response, queryParams, opts });
    });
  }

  request(queryParams?: NuxeoPageProviderParams, opts?: NuxeoRequestOptions): Observable<NuxeoPagination> {
    const params = this.getRequestParams(queryParams);
    const options = this.getRequestOptions(opts);
    return this.execute(this.getRequestUrl(), params, options);
  }

  onSearch(): Observable<{ response: NuxeoPagination, queryParams: NuxeoPageProviderParams, opts: NuxeoRequestOptions }> {
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
