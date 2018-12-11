import { Observable, Subject, ReplaySubject } from 'rxjs';
import { NuxeoPagination, NuxeoApiService, NuxeoRequestParams, NuxeoRequestOptions, join, deepExtend } from './nuxeo';
import { share } from 'rxjs/operators';

export abstract class BasePageProvider {

  protected endPoint: string = 'search';

  protected provider: string = 'creative_website_search';

  protected entities$ = new Subject<NuxeoPagination>();

  protected queryParams$ = new ReplaySubject<{ queryParams: {}, opts: {} }>();

  constructor(protected nuxeoApi: NuxeoApiService) {

  }

  protected getRequestParams(opts: any = {}): NuxeoRequestParams {
    return deepExtend(new NuxeoRequestParams(), opts || new NuxeoRequestParams());
  }

  protected getRequestOptions(opts: any = {}): NuxeoRequestOptions {
    return deepExtend(new NuxeoRequestOptions(), opts || new NuxeoRequestOptions());
  }

  protected getRequestUrl(): string {
    return join(this.endPoint, 'pp', this.provider, 'execute');
  }

  search(queryParams?: NuxeoRequestParams, opts?: NuxeoRequestOptions): void {
    const params = this.getRequestParams(queryParams);
    const options = this.getRequestOptions(opts);
    this.execute(this.getRequestUrl(), params, options).subscribe((pagination: NuxeoPagination) => {
      this.entities$.next(pagination);
      this.queryParams$.next({ queryParams: params, opts: options });
    });
  }

  onSearch(): Observable<NuxeoPagination> {
    return this.entities$.pipe(share());
  }

  onParamChanged(): Observable<{ queryParams: {}, opts: {} }> {
    return this.queryParams$.pipe(share());
  }

  protected execute(url: string, queryParams: any = {}, opts: NuxeoRequestOptions): Observable<NuxeoPagination> {
    return this.nuxeoApi.pageProvider(url, queryParams, opts);
  }

}
