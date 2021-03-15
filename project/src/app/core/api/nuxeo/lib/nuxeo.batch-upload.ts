import { HttpEvent, HttpEventType } from '@angular/common/http';
import { of as observableOf, Observable, Subject } from 'rxjs';
import { map, concatMap, tap } from 'rxjs/operators';
import { Base } from './base.api';
import { join } from '../../../services/helpers';
import { NuxeoUploadResponse, BatchBlob, NuxeoBlob } from './base.interface';


export class PendingRequest {
  constructor(readonly blob: NuxeoBlob, readonly subscription: Subject<NuxeoUploadResponse>) {
  }
}

export class BatchUpload extends Base {

  private _uploadUrl: any;
  private _uploadIndex: number;
  private _batchId: string;
  private _queue: PendingRequest[];

  constructor(opts: any = {}) {
    super(opts);
    this._uploadUrl = join(opts.url, 'upload/');
    this._batchId = opts.batchId || null;
    this._nuxeo = opts.nuxeo;
    this._uploadIndex = -1;
    this._queue = [];
  }

  get batchId(): string {
    return this._batchId;
  }

  upload(blob: NuxeoBlob): Observable<NuxeoUploadResponse> {
    return this.addFileToQueue(blob);
  }

  private uploadFile(blob: NuxeoBlob): Observable<HttpEvent<any>> {
    if (!this._batchId) {
      return observableOf(null);
    }
    const index = Number.isInteger(blob.fileIdx) ? blob.fileIdx : (this._uploadIndex += 1);
    const opts = {
      json: false,
      method: 'POST',
      url: join(this._uploadUrl, this._batchId, index.toString()),
      body: blob.content,
      reportProgress: true,
      headers: {
        'Cache-Control': 'no-cache',
        'X-File-Name': encodeURIComponent(blob.name),
        'X-File-Size': blob.size,
        'X-File-Type': blob.mimeType,
        'Content-Length': blob.size,
      },
    };
    const options = this._computeOptions(opts);
    return this._nuxeo.httpRequest(options);
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

  private addFileToQueue(blob: NuxeoBlob): Observable<NuxeoUploadResponse> {
    const subject = new Subject<NuxeoUploadResponse>();
    this._queue.push(new PendingRequest(blob, subject));
    if (this._queue.length === 1) {
      this.startNext();
    }
    return subject;
  }

  private executeQueue(pending: PendingRequest): void {
    this.fetchBatchId().pipe(concatMap(_ => this.uploadFile(pending.blob))).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          const fileIdx = Number.isInteger(pending.blob.fileIdx) ? pending.blob.fileIdx : this._uploadIndex;
          const xpath = pending.blob.xpath;
          const formMode = pending.blob.formMode;
          const mimeType = pending.blob.mimeType;
          const fileName = pending.blob.name;
          const fileSize = pending.blob.size;
          const blob = pending.blob;
          const kbLoaded = event.loaded;
          const uploaded = false;
          const percentLoaded = Math.round(100 * event.loaded / event.total);
          pending.subscription.next(new NuxeoUploadResponse({ fileName, fileSize, mimeType, uploaded, percentLoaded, kbLoaded, fileIdx, blob, xpath, formMode }));
          break;
        case HttpEventType.Response:
          const body = event.body;
          body.uploaded = body.uploaded === 'true';
          body.dropped = body.dropped === 'true';
          body.uploadedSize = Number(body.uploadedSize);
          body.fileIdx = Number(body.fileIdx);
          body.mimeType = pending.blob.mimeType;
          body.fileName = pending.blob.name;
          const response = new NuxeoUploadResponse(Object.assign({
            percentLoaded: 100,
            blob: pending.blob,
            fileIdx: body.fileIdx,
            fileSize: pending.blob.size,
            kbLoaded: body.uploadedSize,
            xpath: pending.blob.xpath,
            formMode: pending.blob.formMode,
            batchBlob: new BatchBlob(body),
          }, body));
          pending.subscription.next(response);
          this._queue.shift();
          this.startNext();
          break;
      }
    });
  }

  private startNext(): void {
    if (this._queue.length > 0) {
      this.executeQueue(this._queue[0]);
    }
  }

}
