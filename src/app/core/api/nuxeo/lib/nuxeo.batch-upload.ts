import { Base } from './base.api';
import { deepExtend } from '../../../services';
import { join, flatten } from '../../../services';
import { BatchBlob } from './nuxeo.batch-blob';
import { Queue } from '@core/api/nuxeo/lib/nuxeo.queue';
import { of as observableOf, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

const DEFAULT_OPTS = {
  concurrency: 5,
};

export class BatchUpload extends Base {
  private _url: any;
  private _uploadIndex: any;
  private _queue;
  private _batchIdPromise: any;
  private _batchId: any;
  private _promises: any[];

  constructor(opts: any = {}) {
    const options = deepExtend(opts, DEFAULT_OPTS );
    super(options);
    this._url = join(options.url, 'upload/');
    this._nuxeo = options.nuxeo;
    this._uploadIndex = 0;
    Queue.configure(this._nuxeo.Promise);
    this._queue = new Queue(options.concurrency, Infinity);
    this._batchIdPromise = null;
    this._batchId = null;
    this._promises = [];
  }

  upload(...blobs: any[]): any {
    const allBlobs = flatten(blobs);

    const promises = allBlobs.map((blob) => {
      const promise = this._queue.add(this._upload.bind(this, blob));
      this._promises.push(promise);
      return promise;
    });
    console.log(promises, 'promises');

    console.log(this._queue, '_queue');

    if (promises.length === 1) {
      return promises[0];
    }

    const { Promise } = this._nuxeo;
    return Promise.all(promises).then((batchBlobs) => {
      return {
        blobs: batchBlobs.map((batchBlob) => batchBlob.blob),
        batch: this,
      };
    });
  }

  private _upload(blob: any): Observable<any> {
    if (!this._batchIdPromise) {
      this._fetchBatchId().subscribe((res) => {
        this._batchIdPromise = res;
      });
    }

    const uploadIndex = this._uploadIndex;
    this._uploadIndex += 1;
    const opts = {
      json: false,
      method: 'POST',
      url: join(this._url, this._batchId, uploadIndex),
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

    return this._batchIdPromise.pipe(
      mergeMap(_ => this._nuxeo.http(options)),
      map((res: any) => {
        res.batchId = this._batchId;
        res.index = uploadIndex;
        return {
          blob: new BatchBlob(res),
          batch: this,
        };
      }));
  }

  private _fetchBatchId(): Observable<any> {
    const opts = {
      method: 'POST',
      url: this._url,
    };

    if (this._batchId) {
      return observableOf(this);
    }
    const options = this._computeOptions(opts);
    return this._nuxeo.http(options).pipe(
      map((res: any) => {
      this._batchId = res.batchId;
      return this;
    }));
  }

  done(): any {
    const { Promise } = this._nuxeo;
    return Promise.all(this._promises).then((batchBlobs) => {
      return {
        blobs: batchBlobs.map((batchBlob) => batchBlob.blob),
        batch: this,
      };
    });
  }

  isFinished(): any {
    return this._queue.getQueueLength() === 0 && this._queue.getPendingLength() === 0;
  }

  cancel(opts: any): any {
    const { Promise } = this._nuxeo;
    if (!this._batchIdPromise) {
      return Promise.resolve(this);
    }

    const path = join('upload', this._batchId);
    return this._batchIdPromise.then(() => {
      const options = this._computeOptions(opts);
      return this._nuxeo.request(path)
        .delete(options);
    }).then(() => {
      this._batchIdPromise = null;
      this._batchId = null;
      return this;
    });
  }

  fetchBlob(index, opts = {}): any {
    const { Promise } = this._nuxeo;
    if (!this._batchId) {
      return Promise.reject(new Error('No \'batchId\' set'));
    }

    let options = {
      method: 'GET',
      url: join(this._url, this._batchId, index),
    };
    options = deepExtend(true, options, opts);
    options = this._computeOptions(options);
    return this._nuxeo.http(options).then((res) => {
      res.batchId = this._batchId;
      res.index = index;
      return {
        batch: this,
        blob: new BatchBlob(res),
      };
    });
  }

  removeBlob(index, opts = {}) {
    const { Promise } = this._nuxeo;
    if (!this._batchId) {
      return Promise.reject(new Error('No \'batchId\' set'));
    }

    let options = {
      method: 'DELETE',
      url: join(this._url, this._batchId, index),
    };
    options = deepExtend(true, options, opts);
    options = this._computeOptions(options);
    return this._nuxeo.http(options);
  }

  fetchBlobs(opts = {}) {
    const { Promise } = this._nuxeo;
    if (!this._batchId) {
      return Promise.reject(new Error('No \'batchId\' set'));
    }

    let options = {
      method: 'GET',
      url: join(this._url, this._batchId),
    };
    options = deepExtend(true, options, opts);
    options = this._computeOptions(options);
    return this._nuxeo.http(options).then((blobs) => {
      const batchBlobs = blobs.map((blob, index) => {
        blob.batchId = this._batchId;
        blob.index = index;
        return new BatchBlob(blob);
      });
      return {
        batch: this,
        blobs: batchBlobs,
      };
    });
  }
}
