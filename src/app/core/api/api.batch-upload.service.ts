import { Injectable } from '@angular/core';
import { NuxeoApiService, NuxeoUploadResponse } from '@core/api/nuxeo';
import { AbstractBaseService } from './api.abstract-base.service';
import { NuxeoBlob, BatchUpload } from '@core/api/nuxeo/lib';
import { Observable } from 'rxjs';
import { BatchUploadQueue, BatchUploadQueueEvent } from './nuxeo/lib/nuxeo.batch-upload-queue';

@Injectable()
export class BatchUploadService extends AbstractBaseService {

  private batchUpload: BatchUpload;

  constructor(protected nuxeoApi: NuxeoApiService) {
    super(nuxeoApi);
  }

  newInstance(batchId: string = null): BatchUpload {
    return this.nuxeoApi.batchUpload({ batchId });
  }

  getInstance(): BatchUpload {
    return this.batchUpload || (this.batchUpload = this.newInstance());
  }

  upload(files: File[] = []): Observable<BatchUploadQueueEvent> {
    const blobs: NuxeoBlob[] = files.map(file => new NuxeoBlob({ content: file }));
    return this.getInstance().upload(blobs);
  }

  cancel(): Observable<NuxeoUploadResponse> {
    return this.getInstance().cancel();
  }

}
