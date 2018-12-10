import { Injectable } from '@angular/core';
import { NuxeoApiService, BasePageProvider } from '@core/api';

@Injectable()
export class ImageGalleryDataSource extends BasePageProvider {

  constructor(protected nuxeoApi: NuxeoApiService) {
    super(nuxeoApi);
  }

}
