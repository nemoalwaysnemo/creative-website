import { Base } from './base.api';
import { join } from '../../../services';
import { Observable } from 'rxjs';
import { NuxeoResponse } from './base.interface';

export class Directory extends Base {

  private _directoryName: string;
  private _path: string;

  constructor(opts: any = {}) {
    super(opts);
    this._nuxeo = opts.nuxeo;
    this._directoryName = opts.directoryName;
    this._path = join('directory', this._directoryName);
  }

  fetchAll(opts: any = {}): Observable<NuxeoResponse> {
    const options = this._computeOptions(opts);
    const path = this._path;
    options.directory = this;
    return this._nuxeo.request(path)
      .get(options);
  }

  fetch(id: string, opts: any = {}): Observable<NuxeoResponse> {
    const options = this._computeOptions(opts);
    const path = join(this._path, id);
    options.directory = this;
    return this._nuxeo.request(path)
      .get(options);
  }

}
