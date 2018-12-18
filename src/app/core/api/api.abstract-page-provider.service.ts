import { Observable, Subject, ReplaySubject } from 'rxjs';
import { share } from 'rxjs/operators';
import {
  NuxeoPagination,
  NuxeoApiService,
  NuxeoRequestParams,
  NuxeoRequestOptions,
  deepExtend,
  join,
} from './nuxeo';

export abstract class AbstractPageProvider {

  protected endPoint: string = 'search';

  protected provider: string = 'creative_website_search';

  protected entries$ = new Subject<NuxeoPagination>();

  protected queryParams$ = new ReplaySubject<{ queryParams: {}, opts: {} }>();

  constructor(protected nuxeoApi: NuxeoApiService) {

  }

  protected getRequestParams(opts: any = {}): NuxeoRequestParams {
    return deepExtend(new NuxeoRequestParams(), opts || {});
  }

  protected getRequestOptions(opts: any = {}): NuxeoRequestOptions {
    return deepExtend(new NuxeoRequestOptions(), opts || {});
  }

  protected getRequestUrl(): string {
    return join(this.endPoint, 'pp', this.provider, 'execute');
  }

  search(queryParams?: NuxeoRequestParams, opts?: NuxeoRequestOptions): void {
    const params = this.getRequestParams(queryParams);
    const options = this.getRequestOptions(opts);
    this.request(params, options).subscribe((pagination: NuxeoPagination) => {
      this.entries$.next(pagination);
      this.queryParams$.next({ queryParams: params, opts: options });
    });
  }

  request(queryParams?: NuxeoRequestParams, opts?: NuxeoRequestOptions): Observable<NuxeoPagination> {
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
