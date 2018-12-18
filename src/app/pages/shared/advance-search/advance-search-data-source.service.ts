import { Injectable } from '@angular/core';
import { NuxeoApiService, AbstractPageProvider, NuxeoRequestParams, NuxeoPagination } from '@core/api';
import { Observable } from 'rxjs';

@Injectable()
export class AdvanceSearchDataSource extends AbstractPageProvider<NuxeoPagination> {

  private defaultParams: NuxeoRequestParams;

  constructor(protected nuxeoApi: NuxeoApiService) {
    super(nuxeoApi);
    this.defaultParams = new NuxeoRequestParams();
  }

  requestSearchFilters(): Observable<NuxeoPagination> {
    return this.request({ pageSize: 0 });
  }

  searchForText(param: string): Observable<NuxeoPagination> {
    const text: string = '*' + param;
    return this.request({ ecm_fulltext: text, pageSize: 10 });
  }
}
