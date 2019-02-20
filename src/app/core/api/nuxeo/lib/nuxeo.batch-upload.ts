import { Base } from './base.api';
import { deepExtend } from '../../../services';
import { join, flatten } from '../../../services';
import { BatchBlob } from './nuxeo.batch-blob';
import { of as observableOf, Observable } from 'rxjs';
import { map, concatMap, tap } from 'rxjs/operators';
import { NuxeoUploadResponse } from './base.interface';
import { NuxeoBlob } from './nuxeo.blob';

const DEFAULT_OPTS = {
  concurrency: 5,
};

export class BatchUpload extends Base {

  private _url: any;
  private _uploadIndex: number;
  private _batchId: string;
  private _queue: any[];

  constructor(opts: any = {}) {
    const options = deepExtend(opts, DEFAULT_OPTS);
    super(options);
    this._url = join(options.url, 'upload/');
    this._nuxeo = options.nuxeo;
    this._batchId = opts.batchId || null;
    this._uploadIndex = 0;
  }

  get batchId(): string {
    return this._batchId;
  }

  upload(blobs: any[]) {
    const blob = blobs.shift();
    this.fetchBatchId().pipe(
      concatMap(() => this.uploadFile(blob)),
    ).subscribe(res => {
      console.log(44444, res);
    });
    return observableOf(null);
  }

  private uploadFiles(blobs: NuxeoBlob[]) {

  }

  private uploadFile(blob: NuxeoBlob): Observable<BatchBlob> {
    if (!this._batchId) {
      return observableOf(this._batchId);
    }
    this._uploadIndex += 1;
    const opts = {
      json: false,
      method: 'POST',
      url: join(this._url, this._batchId, this._uploadIndex.toString()),
      body: blob.content,
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
      map((res: NuxeoUploadResponse) => observableOf(new BatchBlob(res))),
    );
  }

  private fetchBatchId(): Observable<string> {
    if (this._batchId) {
      return observableOf(this._batchId);
    }
    const opts = { method: 'POST', url: this._url };
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
      tap(() => { this._batchId = null; }),
    );
  }

}
