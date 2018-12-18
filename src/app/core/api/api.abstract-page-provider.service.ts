import { Observable, Subject, ReplaySubject } from 'rxjs';
import { share } from 'rxjs/operators';
import { AbstractBaseService } from './api.abstract-base.service';

import {
  NuxeoPagination,
  NuxeoPageProviderParams,
  NuxeoRequestOptions,
  deepExtend,
  join,
} from './nuxeo';

export abstract class AbstractPageProvider extends AbstractBaseService {

  protected endPoint: string = 'search';

  protected provider: string = 'creative_website_search';

  protected entries$ = new Subject<NuxeoPagination>();

  protected queryParams$ = new ReplaySubject<{ queryParams: {}, opts: {} }>();

  protected getRequestParams(opts: any = {}): NuxeoPageProviderParams {
    return deepExtend(new NuxeoPageProviderParams(), opts || {});
  }

  protected getRequestUrl(): string {
    return join(this.endPoint, 'pp', this.provider, 'execute');
  }

  search(queryParams?: NuxeoPageProviderParams, opts?: NuxeoRequestOptions): void {
    const params = this.getRequestParams(queryParams);
    const options = this.getRequestOptions(opts);
    this.request(params, options).subscribe((pagination: NuxeoPagination) => {
      this.entries$.next(pagination);
      this.queryParams$.next({ queryParams: params, opts: options });
    });
  }

  request(queryParams?: NuxeoPageProviderParams, opts?: NuxeoRequestOptions): Observable<NuxeoPagination> {
    const params = this.getRequestParams(queryParams);
    const options = this.getRequestOptions(opts);
    return this.execute(this.getRequestUrl(), params, options);
  }

  onSearch(): Observable<NuxeoPagination> {
    return this.entries$.pipe(share());
  }

  onParamChanged(): Observable<{ queryParams: {}, opts: {} }> {
    return this.queryParams$.pipe(share());
  }

  protected execute(url: string, queryParams: any = {}, opts: NuxeoRequestOptions): Observable<NuxeoPagination> {
    return this.nuxeoApi.pageProvider(url, queryParams, opts);
  }

}
