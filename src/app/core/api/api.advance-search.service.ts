import { Injectable } from '@angular/core';
import { NuxeoApiService, NuxeoPageProviderParams, NuxeoPagination, AggregateModel, NuxeoRequestOptions } from './nuxeo';
import { AbstractPageProvider } from './api.abstract-page-provider.service';
import { of as observableOf, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentModel } from './nuxeo/lib';

@Injectable({
  providedIn: 'root',
})
export class AdvanceSearch extends AbstractPageProvider {

  constructor(protected nuxeoApi: NuxeoApiService) {
    super(nuxeoApi);
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
}
