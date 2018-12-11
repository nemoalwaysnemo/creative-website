import { Injectable } from '@angular/core';
import { NuxeoApiService, BasePageProvider, NuxeoPagination } from '@core/api';
import { Observable, Subject, ReplaySubject } from 'rxjs';

@Injectable()
export class HomeSearchDataSource extends BasePageProvider {

  constructor(protected nuxeoApi: NuxeoApiService) {
    super(nuxeoApi);
  }

  searchForText(param: string): Observable<NuxeoPagination> {
    const text: string = '*' + param;
    return super.request({ ecm_fulltext: text, pageSize: 10 });
  }
}
