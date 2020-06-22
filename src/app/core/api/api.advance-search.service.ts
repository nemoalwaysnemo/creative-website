import { Injectable } from '@angular/core';
import { Observable, of as observableOf, Subject } from 'rxjs';
import { share, concat, map, tap, filter } from 'rxjs/operators';
import { DocumentModel } from './nuxeo/lib';
import { join } from '../services/helpers';
import { AbstractBaseSearchService } from './api.abstract-base-search.service';
import { NuxeoPagination, NuxeoPageProviderParams, NuxeoRequestOptions, NuxeoApiService } from './nuxeo';

export class SearchResponse {
  response: NuxeoPagination;
  readonly searchParams: NuxeoPageProviderParams;
  readonly metadata: { [key: string]: any } = {};
  readonly action: string;
  readonly source: string;
  constructor(response: any = {}) {
    Object.assign(this, response);
  }
}

@Injectable({
  providedIn: 'root',
})
export class AdvanceSearchService extends AbstractBaseSearchService {

  protected endPoint: string = 'search';

  protected provider: string = 'creative_website_search';

  protected entries$ = new Subject<SearchResponse>();

  constructor(protected nuxeoApi: NuxeoApiService) {
    super(nuxeoApi);
  }

  protected getRequestUrl(provider?: string): string {
    return join(this.endPoint, 'pp', (provider || this.provider), 'execute');
  }

  operation(id: string, params: any = {}, input: string = null, opts: any = null): Observable<any> {
    return this.nuxeoApi.operation(id, params, input, opts);
  }

  search(provider: string, searchParams: NuxeoPageProviderParams = new NuxeoPageProviderParams(), opts: NuxeoRequestOptions = new NuxeoRequestOptions(), metadata: { [key: string]: any } = {}): Observable<SearchResponse> {
    return observableOf(new SearchResponse({ response: new NuxeoPagination(), searchParams, metadata, source: metadata.source, action: 'beforeSearch' })).pipe(
      concat(this.request(searchParams, opts, provider).pipe(map((response: NuxeoPagination) => (new SearchResponse({ response, searchParams, metadata, source: metadata.source, action: 'afterSearch' }))))),
      tap((res: SearchResponse) => this.entries$.next(res)),
      share(),
    );
  }

  request(searchParams: NuxeoPageProviderParams, opts?: NuxeoRequestOptions, provider: string = this.provider): Observable<NuxeoPagination> {
    const params: NuxeoPageProviderParams = this.getRequestParams(searchParams);
    const options: NuxeoRequestOptions = this.getRequestOptions(opts);
    return this.execute(this.getRequestUrl(provider), params.toParams(), options);
  }

  onSearch(source?: string): Observable<SearchResponse> {
    return this.entries$.pipe(filter((e: SearchResponse) => source ? e.source === source : true)).pipe(share());
  }

  requestByUIDs(uids: string[]): Observable<NuxeoPagination> {
    const params = {
      pageSize: uids.length,
      ecm_uuid: `["${uids.join('", "')}"]`,
    };
    return this.request(new NuxeoPageProviderParams(params), new NuxeoRequestOptions({ schemas: ['dublincore'] }));
  }

  requestTitleByUIDs(res: NuxeoPagination, properties: string[]): Observable<NuxeoPagination> {
    let ids = [];
    const listNew: any = {};
    properties.forEach((pro: string) => {
      res.entries.forEach((doc: DocumentModel) => {
        const hasProperties = doc.get(pro);
        if (hasProperties && hasProperties.length > 0) {
          if (typeof (hasProperties) === 'string') {
            ids.push(hasProperties);
          } else {
            ids = ids.concat(hasProperties);
          }
        }
      });
    });

    const distIds: string[] = Array.from(new Set(ids));
    if (distIds.length > 0) {
      const params = {
        pageSize: distIds.length,
        ecm_uuid: `["${distIds.join('", "')}"]`,
      };

      return this.request(new NuxeoPageProviderParams(params), new NuxeoRequestOptions({ schemas: ['The_Loupe_Main'] }))
        .pipe(
          map((response: NuxeoPagination) => {
            response.entries.forEach((resDoc: DocumentModel) => { listNew[resDoc.uid] = resDoc.title; });
            properties.forEach((pro: string) => {
              for (const doc of res.entries) {
                doc.properties[pro + '_title_'] = listNew[doc.get(pro)] ? listNew[doc.get(pro)] : null;
              }
            });
            return res;
          }),
        );
    }
    return observableOf(res);
  }

  protected execute(url: string, queryParams: any = {}, opts: NuxeoRequestOptions): Observable<NuxeoPagination> {
    return this.nuxeoApi.pageProvider(url, queryParams, opts);
  }

}
