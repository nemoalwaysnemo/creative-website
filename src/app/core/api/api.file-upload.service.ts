import { Injectable } from '@angular/core';
import { NuxeoApiService } from '@core/api/nuxeo';
import { AbstractBaseService } from './api.abstract-base.service';
import { Blob } from '@core/api';

@Injectable()
export class FileUploadService extends AbstractBaseService {
  // private blob: Blob;


  constructor(protected nuxeoApi: NuxeoApiService) {
    super(nuxeoApi);
  }

  upload(file: File) {
    const blob = new Blob({ content: file });
    console.log(blob);

    this.nuxeoApi.upload().upload([blob, blob]).then(function (res) {
      console.log(res, 'res');
      // res.blob instanceof BatchBlob === true
    }).catch(function (error) {
      throw new Error(error);
    });

  }

}
