import { Base } from './base.api';
import { join } from '../../../services';
import { DocumentModel } from './nuxeo.document-model';
import { Observable } from 'rxjs';

export class Repository extends Base {

  constructor(opts: any = {}) {
    super(opts);
    this._nuxeo = opts.nuxeo;
  }

  create(parentRef: string, doc: DocumentModel, opts: any = {}): Observable<DocumentModel> {
    opts.body = {
      'entity-type': 'document',
      type: doc.type,
      name: doc.name || doc.properties['dc:title']  || doc.get('dc:title'),
      properties: doc.properties,
    };
    const options = this._computeOptions(opts);
    const path = this._computePath(parentRef);
    options.repository = this;
    return this._nuxeo.request(path).post(options);
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

  delete(ref: string, opts: any = {}): Observable<DocumentModel>  {
    const options = this._computeOptions(opts);
    const path = this._computePath(ref);
    options.repository = this;
    return this._nuxeo.request(path).delete(options);
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
