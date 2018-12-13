import { Injectable } from '@angular/core';
import { NuxeoApiService, BasePageProvider } from '@core/api';

@Injectable()
export class PictureGalleryDataSource extends BasePageProvider {

  constructor(protected nuxeoApi: NuxeoApiService) {
    super(nuxeoApi);
  }

}
