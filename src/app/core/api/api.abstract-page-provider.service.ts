import { Observable, ReplaySubject } from 'rxjs';
import { share } from 'rxjs/operators';
import { AbstractBaseService } from './api.abstract-base.service';
import { join } from '../services';
import {
  NuxeoPagination,
  NuxeoPageProviderParams,
  NuxeoRequestOptions,
  AggregateModel,
} from './nuxeo';

export abstract class AbstractPageProvider extends AbstractBaseService {

  protected endPoint: string = 'search';

  protected provider: string = 'creative_website_search';

  protected entries$ = new ReplaySubject<{ response: NuxeoPagination, queryParams: NuxeoPageProviderParams, opts: NuxeoRequestOptions, action: string }>(1);

  protected getRequestUrl(provider?: string): string {
    return join(this.endPoint, 'pp', (provider || this.provider), 'execute');
  }

  search(queryParams: NuxeoPageProviderParams = {}, opts: NuxeoRequestOptions = {}): void {
    this.entries$.next({ response: new NuxeoPagination(), queryParams, opts, action: 'beforeSearch' });
    this.request(queryParams, opts).subscribe((response: NuxeoPagination) => {
      this.entries$.next({ response, queryParams, opts, action: 'afterSearch' });
    });
  }

  request(queryParams?: NuxeoPageProviderParams, opts?: NuxeoRequestOptions, provider: string = this.provider): Observable<NuxeoPagination> {
    const params = this.getRequestParams(queryParams);
    const options = this.getRequestOptions(opts);
    return this.execute(this.getRequestUrl(provider), params, options);
  }

  onSearch(): Observable<{ response: NuxeoPagination, queryParams: NuxeoPageProviderParams, opts: NuxeoRequestOptions, action: string }> {
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
