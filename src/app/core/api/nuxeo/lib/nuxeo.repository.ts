import { Base } from './base.api';
import { join } from '../../../services';
import { DocumentModel } from './nuxeo.document-model';
import { Observable } from 'rxjs';

export class Repository extends Base {

  constructor(opts: any = {}) {
    super(opts);
    this._nuxeo = opts.nuxeo;
  }

  update(doc: DocumentModel, opts: any = {}) {
    opts.body = {
      'entity-type': 'document',
      uid: doc.uid,
      properties: doc.properties,
    };
    const options = this._computeOptions(opts);
    const path = join('id', doc.uid);
    options.repository = this;
    return this._nuxeo.request(path).put(options);
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
