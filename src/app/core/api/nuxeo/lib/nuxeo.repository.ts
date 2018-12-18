import { Base } from './base.api';
import { join } from './nuxeo.helpers';
import { DocumentModel } from './nuxeo.document-model';
import { Observable } from 'rxjs';

export class Repository extends Base {

  constructor(opts: any = {}) {
    super(opts);
    this._nuxeo = opts.nuxeo;
  }

  fetch(ref: string, opts: any = {}): Observable<DocumentModel> {
    const options = this._computeOptions(opts);
    const path = this._computePath(ref);
    options.repository = this;
    return this._nuxeo.request(path).get(options);
  }

  _computePath(ref: string): string {
    return join(ref.indexOf('/') === 0 ? 'path' : 'id', ref);
  }

}
