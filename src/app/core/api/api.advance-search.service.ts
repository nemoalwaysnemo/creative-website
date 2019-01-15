import { Injectable } from '@angular/core';
import { NuxeoApiService, NuxeoPageProviderParams, NuxeoPagination, AggregateModel } from './nuxeo';
import { AbstractPageProvider } from './api.abstract-page-provider.service';
import { NUXEO_META_INFO } from '@environment/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { deepExtend } from '@core/services';

@Injectable()
export class AdvanceSearch extends AbstractPageProvider {

  private defaultParams: NuxeoPageProviderParams = new NuxeoPageProviderParams();

  constructor(protected nuxeoApi: NuxeoApiService) {
    super(nuxeoApi);
    this.defaultParams.ecm_path = NUXEO_META_INFO.BASE_FOLDER_PATH;
  }

  private getDefaultRequestParams(opts: any = {}): NuxeoPageProviderParams {
    return deepExtend({}, this.defaultParams, opts);
  }

  requestSearchFilters(queryParams: NuxeoPageProviderParams = {}): Observable<AggregateModel[]> {
    return this.request(this.getRequestParams(Object.assign({}, queryParams, { pageSize: 1 }))).pipe(
      map((response: NuxeoPagination) => this.buildAggregateModels(response)),
    );
  }

  searchForText(searchTerm: string, queryParams: any = {}): void {
    this.search(this.getDefaultRequestParams({ ecm_fulltext: searchTerm, ...queryParams }));
  }
}
