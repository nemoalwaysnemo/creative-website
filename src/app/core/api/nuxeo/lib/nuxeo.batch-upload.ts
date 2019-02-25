import { Base } from './base.api';
import { join } from '../../../services';
import { BatchBlob } from './nuxeo.batch-blob';
import { of as observableOf, Observable } from 'rxjs';
import { map, concatMap, tap } from 'rxjs/operators';
import { NuxeoUploadResponse } from './base.interface';
import { NuxeoBlob } from './nuxeo.blob';
import { BatchUploadQueue, BatchUploadQueueEvent } from './nuxeo.batch-upload-queue';

export class BatchUpload extends Base {

  private _uploadUrl: any;
  private _uploadIndex: number;
  private _batchId: string;
  private _queue: BatchUploadQueue;

  constructor(opts: any = {}) {
    super(opts);
    this._queue = new BatchUploadQueue();
    this._uploadUrl = join(opts.url, 'upload/');
    this._batchId = opts.batchId || 'batchId-f8e6bf41-643e-4db3-bfbb-f5766dcdb7b2';
    this._nuxeo = opts.nuxeo;
    this._uploadIndex = 0;
  }

  get batchId(): string {
    return this._batchId;
  }

  upload(blobs: NuxeoBlob[] = []): Observable<BatchUploadQueueEvent> {
    return this.fetchBatchId().pipe(
      tap(_ => { blobs.forEach((blob) => { this._queue.addFileToQueue(this.uploadFile.bind(this, blob)); }); this._queue.start(); }),
      concatMap(_ => this._queue.event$),
    );
  }

  private uploadFile(blob: NuxeoBlob): Observable<BatchBlob> {
    if (!this._batchId) {
      return observableOf(null);
    }
    this._uploadIndex += 1;
    const opts = {
      json: false,
      method: 'POST',
      url: join(this._uploadUrl, this._batchId, this._uploadIndex.toString()),
      body: blob.content,
      reportProgress: false,
      headers: {
        'Cache-Control': 'no-cache',
        'X-File-Name': encodeURIComponent(blob.name),
        'X-File-Size': blob.size,
        'X-File-Type': blob.mimeType,
        'Content-Length': blob.size,
      },
    };
    const options = this._computeOptions(opts);
    return this._nuxeo.http(options).pipe(
      map((res: string) => new NuxeoUploadResponse(JSON.parse(res))),
      map((res: NuxeoUploadResponse) => new BatchBlob(res)),
    );
  }

  private fetchBatchId(): Observable<string> {
    if (this._batchId) {
      return observableOf(this._batchId);
    }
    const opts = { method: 'POST', url: this._uploadUrl };
    const options = this._computeOptions(opts);
    return this._nuxeo.http(options).pipe(
      map((res: any) => res.batchId),
      tap((batchId: string) => { this._batchId = batchId; }),
    );
  }

  cancel(opts: any = {}): Observable<NuxeoUploadResponse> {
    if (!this._batchId) {
      return observableOf(new NuxeoUploadResponse({ dropped: false }));
    }
    const path = join('upload', this._batchId);
    const options = this._computeOptions(opts);
    return this._nuxeo.request(path).delete(options).pipe(
      map((res: any) => new NuxeoUploadResponse(res)),
      tap(_ => { this._batchId = null; }),
    );
  }

}
