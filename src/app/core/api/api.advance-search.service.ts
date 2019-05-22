import { Injectable } from '@angular/core';
import { NuxeoApiService, NuxeoPageProviderParams, NuxeoPagination, AggregateModel } from './nuxeo';
import { AbstractPageProvider } from './api.abstract-page-provider.service';
import { NUXEO_PATH_INFO } from '@environment/environment';
import { of as observableOf, Observable } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';
import { DocumentModel } from './nuxeo/lib';

@Injectable()
export class AdvanceSearch extends AbstractPageProvider {

  constructor(protected nuxeoApi: NuxeoApiService) {
    super(nuxeoApi);
    this.defaultParams.ecm_path = NUXEO_PATH_INFO.CREATIVE_BASE_FOLDER_PATH;
  }

  requestSearchFilters(queryParams: NuxeoPageProviderParams = {}): Observable<AggregateModel[]> {
    return this.request(this.getRequestParams(Object.assign({}, queryParams, { pageSize: 1 })), { skipAggregates: false }).pipe(
      map((response: NuxeoPagination) => this.buildAggregateModels(response)),
      concatMap((models: AggregateModel[]) => this.requestIDsOfAggregates(models)),
    );
  }

  requestIDsOfAggregates(models: AggregateModel[]): Observable<AggregateModel[]> {
    // let ids = [];
    // models.forEach((model: AggregateModel) => { ids = ids.concat(model.IDKeys); });
    // if (ids.length > 0) {
    //   return this.request({ ecm_uuid: `["${ids.join('", "')}"]`, pageSize: 999 }).pipe(
    //     map((response: NuxeoPagination) => {
    //       const list: any = {};
    //       response.entries.forEach((doc: DocumentModel) => { list[doc.uid] = doc.title; });
    //       for (const model of models) {
    //         model.replaceIDWithName(list);
    //       }
    //       return models;
    //     }),
    //   );
    // }
    return observableOf(models);
  }

  searchForText(searchTerm: string, queryParams: NuxeoPageProviderParams = {}): Observable<NuxeoPagination> {
    queryParams.ecm_fulltext = searchTerm;
    return this.request(queryParams);
  }
}
