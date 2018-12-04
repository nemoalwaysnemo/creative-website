import { Base } from './base.api';
import { join } from './nuxeo.helpers';
import { NuxeoResponse } from './base.interface';
import { Observable } from 'rxjs';

export class Repository extends Base {
  private _nuxeo: any;

  constructor(opts: any) {
    super(opts);
    this._nuxeo = opts.nuxeo;
  }

  fetch(ref: any, opts: any = {}): Observable<NuxeoResponse> {
    const options = this._computeOptions(opts);
    const path = this._computePath(ref);
    options.repository = this;
    return this._nuxeo.request(path)
      .get(options);
  }

  // query(queryOpts: any, opts: any = {}): Observable<NuxeoResponse> {
  //   const options = this._computeOptions(opts);
  //   const path = this._computeQueryPath(queryOpts);
  //   options.repository = this;
  //   return this._nuxeo.request(path)
  //   .queryParams(queryOpts)
  //   .get(options);
  // }

  _computePath(ref: string): string {
    return join(ref.indexOf('/') === 0 ? 'path' : 'id', ref);
  }

  // _computeQueryPath(queryOpts: any): string {
  //   const serverVersion = this._nuxeo.serverVersion;
  //   const isSearchEndPoint = serverVersion && serverVersion.gte(LTS_2016);
  //   const path = isSearchEndPoint
  //     ? join('search', queryOpts.query ? 'lang/NXQL' : `pp/${queryOpts.pageProvider}`, 'execute')
  //     : join('query', queryOpts.query ? 'NXQL' : queryOpts.pageProvider);
  //   return path;
  // }
}
