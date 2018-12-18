import { Injectable } from '@angular/core';
import { NuxeoApiService, NuxeoPagination } from '@core/api/nuxeo';
import { AbstractPageProvider } from '@core/api/api.abstract-page-provider.service';

@Injectable()
export class BasePageProvider extends AbstractPageProvider {

  constructor(protected nuxeoApi: NuxeoApiService) {
    super(nuxeoApi);
  }

}
