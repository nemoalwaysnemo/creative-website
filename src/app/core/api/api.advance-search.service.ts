import { Injectable } from '@angular/core';
import { NuxeoApiService, NuxeoPageProviderParams, NuxeoPagination, AggregateModel, NuxeoRequestOptions } from './nuxeo';
import { AbstractPageProvider } from './api.abstract-page-provider.service';
import { NUXEO_PATH_INFO } from '@environment/environment';
import { of as observableOf, Observable } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';
import { DocumentModel } from './nuxeo/lib';

@Injectable()
export class AdvanceSearch extends AbstractPageProvider {

  constructor(protected nuxeoApi: NuxeoApiService) {
    super(nuxeoApi);
  }

  requestSearchFilters(searchParams: NuxeoPageProviderParams = new NuxeoPageProviderParams()): Observable<AggregateModel[]> {
    return this.request(this.getRequestParams(Object.assign({}, searchParams, { pageSize: 1 })), new NuxeoRequestOptions({ skipAggregates: false })).pipe(
      map((response: NuxeoPagination) => this.buildAggregateModels(response)),
      concatMap((models: AggregateModel[]) => this.requestIDsOfAggregates(models)),
    );
  }

  requestIDsOfAggregates(models: AggregateModel[]): Observable<AggregateModel[]> {
    let ids = [];
    models.forEach((model: AggregateModel) => { ids = ids.concat(model.IDKeys); });
    if (ids.length > 0) {
      return this.request(new NuxeoPageProviderParams({ ecm_uuid: `["${ids.join('", "')}"]`, pageSize: 999 })).pipe(
        map((response: NuxeoPagination) => {
          const list: any = {};
          response.entries.forEach((doc: DocumentModel) => { list[doc.uid] = doc.title; });
          for (const model of models) {
            model.replaceIDWithName(list);
          }
          return models;
        }),
      );
    }
    return observableOf(models);
  }

  requestTitleByIds(res: NuxeoPagination, properties: string[]): Observable<NuxeoPagination> {
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
