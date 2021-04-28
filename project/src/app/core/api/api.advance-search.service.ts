import { Injectable } from '@angular/core';
import { Observable, of as observableOf, Subject } from 'rxjs';
import { share, concat, map, tap, filter } from 'rxjs/operators';
import { DocumentModel, NuxeoAutomations } from './nuxeo/lib';
import { join } from '../services/helpers';
import { NuxeoPagination, GlobalSearchParams, NuxeoRequestOptions, NuxeoApiService } from './nuxeo';
import { NUXEO_DOC_TYPE } from '@environment/environment';

export class SearchResponse {
  response: NuxeoPagination;
  readonly searchParams: GlobalSearchParams;
  readonly action: string;
  readonly source: string;
  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}

@Injectable({
  providedIn: 'root',
})
export class AdvanceSearchService {

  protected defaultRepository: string;

  protected endPoint: string = 'search';

  protected provider: string = NUXEO_DOC_TYPE.BASE_SEARCH_PROVIDER;

  protected entries$ = new Subject<SearchResponse>();

  constructor(protected nuxeoApi: NuxeoApiService) {

  }

  protected getRequestUrl(provider?: string): string {
    return join(this.endPoint, 'pp', (provider || this.provider), 'execute');
  }

  get(uuid: string, opts?: any): Observable<DocumentModel> {
    return this.nuxeoApi.repository(this.defaultRepository, new NuxeoRequestOptions(opts)).fetch(uuid);
  }

  create(doc: DocumentModel, opts: any = {}): Observable<DocumentModel> {
    return this.nuxeoApi.repository(this.defaultRepository).create(doc.path || doc.uid, doc, opts);
  }

  operation(id: string, params: any = {}, input: string | string[] = null, opts: any = null): Observable<any> {
    return this.nuxeoApi.operation(id, params, input, opts);
  }

  remoteSearch(searchParams: GlobalSearchParams, opts: NuxeoRequestOptions): Observable<SearchResponse> {
    return observableOf(new SearchResponse({ response: new NuxeoPagination(), searchParams, source: searchParams.source, action: 'beforeSearch' })).pipe(
      concat(this.operation(NuxeoAutomations.TBWARemoteSearch, searchParams.toRequestParams(), null, opts).pipe(
        map(res => new NuxeoPagination(res)),
        map((response: NuxeoPagination) => (new SearchResponse({ response, searchParams, source: searchParams.source, action: 'afterSearch' })))),
      ),
      tap((res: SearchResponse) => this.entries$.next(res)),
      share(),
    );
  }

  providerSearch(provider: string, searchParams: GlobalSearchParams, opts: NuxeoRequestOptions): Observable<SearchResponse> {
    return observableOf(new SearchResponse({ response: new NuxeoPagination(), searchParams, source: searchParams.source, action: 'beforeSearch' })).pipe(
      concat(this.request(searchParams, opts, provider).pipe(
        map((response: NuxeoPagination) => (new SearchResponse({ response, searchParams, source: searchParams.source, action: 'afterSearch' })))),
      ),
      tap((res: SearchResponse) => this.entries$.next(res)),
      share(),
    );
  }

  request(searchParams: GlobalSearchParams, opts: NuxeoRequestOptions = new NuxeoRequestOptions(), provider: string = this.provider): Observable<NuxeoPagination> {
    const params = searchParams instanceof GlobalSearchParams ? searchParams : new GlobalSearchParams(searchParams);
    return this.execute(this.getRequestUrl(provider), params, opts);
  }

  onSearch(source?: string): Observable<SearchResponse> {
    return this.entries$.pipe(filter((e: SearchResponse) => source ? e.source === source : true)).pipe(share());
  }

  requestByUIDs(uids: string[]): Observable<NuxeoPagination> {
    const params: any = {
      pageSize: uids.length,
      ecm_uuid: `["${uids.join('", "')}"]`,
    };
    return this.request(new GlobalSearchParams(params), new NuxeoRequestOptions({ schemas: ['dublincore'] }));
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
      const params: any = {
        pageSize: distIds.length,
        ecm_uuid: `["${distIds.join('", "')}"]`,
      };

      return this.request(new GlobalSearchParams(params), new NuxeoRequestOptions({ schemas: ['The_Loupe_Main'] }))
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

  protected execute(url: string, queryParams: GlobalSearchParams, opts: NuxeoRequestOptions): Observable<NuxeoPagination> {
    return this.nuxeoApi.pageProvider(url, queryParams.toRequestParams(), opts);
  }

}
