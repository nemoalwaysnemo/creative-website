import { Observable, Subject, ReplaySubject } from 'rxjs';
import { NuxeoPagination, NuxeoApiService, NuxeoRequestOptions, join, deepExtend } from './nuxeo';
import { share } from 'rxjs/operators';

export abstract class BasePageProvider {

  protected endPoint: string = 'search';

  protected provider: string = 'creative_website_search';

  protected entities$ = new Subject<NuxeoPagination>();

  protected queryParams$ = new ReplaySubject<{ queryParams: {}, opts: {} }>();

  constructor(protected nuxeoApi: NuxeoApiService) {

  }

  protected getRequestOptions(): NuxeoRequestOptions {
    return new NuxeoRequestOptions();
  }

  protected getRequestUrl(): string {
    return join(this.endPoint, 'pp', this.provider, 'execute');
  }

  search(queryParams: any = {}, opts?: NuxeoRequestOptions): void {
    const options = deepExtend(this.getRequestOptions(), opts || this.getRequestOptions());
    this.execute(this.getRequestUrl(), queryParams, options).subscribe((pagination: NuxeoPagination) => {
      this.entities$.next(pagination);
      this.queryParams$.next({ queryParams: queryParams, opts: options });
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
