import { Injectable } from '@angular/core';
import { NuxeoApiService } from './nuxeo';
import { AbstractPageProvider } from './api.abstract-page-provider.service';

@Injectable()
export class BasePageProvider extends AbstractPageProvider {

  constructor(protected nuxeoApi: NuxeoApiService) {
    super(nuxeoApi);
  }

}
