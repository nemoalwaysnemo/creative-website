import { Observable, Subject, ReplaySubject } from 'rxjs';
import { NuxeoPagination, NuxeoApiService, join } from './nuxeo';
import { share } from 'rxjs/operators';

export abstract class BasePageProvider {

  protected endPoint: string = 'search';

  protected provider: string = 'creative_website_search';

  protected entities$ = new Subject<NuxeoPagination>();
  protected queryParams$ = new ReplaySubject<{ queryParams: {}, opts: {} }>();

  constructor(protected nuxeoApi: NuxeoApiService) {

  }

  protected getRequestUrl(): string {
    return join(this.nuxeoApi.getConfigs().restUrl, this.endPoint, 'pp', this.provider, 'execute');
  }

  protected search(queryParams: any = {}, opts: any = { schemas: ['*'] }): void {
    this.execute(this.getRequestUrl(), queryParams, opts).subscribe((pagination: NuxeoPagination) => {
      this.entities$.next(pagination);
      this.queryParams$.next({ queryParams: queryParams, opts: opts });
    });
  }

  protected onSearch(): Observable<NuxeoPagination> {
    return this.entities$.pipe(share());
  }

  protected onParamChanged(): Observable<{ queryParams: {}, opts: {} }> {
    return this.queryParams$.pipe(share());
  }

  protected execute(url: string, queryParams: any = {}, opts: any = { schemas: ['*'] }): Observable<NuxeoPagination> {
    return this.nuxeoApi.pageProvider(url, queryParams, opts);
  }

}
