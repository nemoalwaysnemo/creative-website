import { Base } from './base.api';
import { join, encodePath } from './nuxeo.helpers';
import { Observable } from 'rxjs';
import { NuxeoResponse } from './base.interface';

export class Request extends Base {
  private _nuxeo: any;
  private _path: string;
  private _queryParams: any;
  private _url: string;

  constructor(opts?: any) {
    const options = Object.assign({}, opts);
    super(options);
    this._nuxeo = options.nuxeo;
    this._path = options.path;
    this._queryParams = options.queryParams;
    this._url = options.url;
  }

  path(path: string): this {
    this._path = join(this._path, path);
    return this;
  }

  queryParams(queryParams: {}): this {
    this._queryParams = Object.assign(this._queryParams, queryParams);
    return this;
  }

  get(opts: any = {}): Observable<NuxeoResponse> {
    opts.method = 'GET';
    return this.execute(opts);
  }

  post(opts: any = {}): Observable<NuxeoResponse> {
    opts.method = 'POST';
    return this.execute(opts);
  }

  // put(opts: any = {}): Observable<NuxeoResponse> {
  //   opts.method = 'PUT';
  //   return this.execute(opts);
  // }

  // delete(opts: any = {}): Observable<NuxeoResponse> {
  //   opts.method = 'DELETE';
  //   return this.execute(opts);
  // }

  execute(opts?: any): Observable<NuxeoResponse> {
    const options = this._computeOptions(opts);

    let path = this._path;
    const repositoryName = options.repositoryName;
    if (repositoryName !== undefined) {
      path = join('repo', repositoryName, path);
    }
    const url = join(this._url, encodePath(path));
    let finalOptions = {
      url,
      queryParams: this._queryParams,
    };
    finalOptions = Object.assign(options, finalOptions);
    return this._nuxeo.http(finalOptions);
  }
}
