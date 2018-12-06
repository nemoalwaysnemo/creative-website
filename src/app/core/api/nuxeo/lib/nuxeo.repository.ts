import { Base } from './base.api';
import { join } from './nuxeo.helpers';
import { ServerVersion } from './nuxeo.server-version';
import { NuxeoResponse } from './base.interface';
import { Observable } from 'rxjs';

export class Repository extends Base {

  constructor(opts: any = {}) {
    super(opts);
    this._nuxeo = opts.nuxeo;
  }

  fetch(ref: any = {}, opts: any = {}): Observable<NuxeoResponse> {
    const options = this._computeOptions(opts);
    const path = this._computePath(ref);
    options.repository = this;
    return this._nuxeo.request(path).get(options);
  }

  _computePath(ref: string): string {
    return join(ref.indexOf('/') === 0 ? 'path' : 'id', ref);
  }

  /**
   * Performs a query returning documents.
   * Named parameters can be set in the `queryOpts` object, such as
   * { query: ..., customParam1: 'foo', anotherParam: 'bar'}
   * @param {object} queryOpts - The query options.
   * @param {string} queryOpts.query - The query to execute. `query` or `pageProvider` must be set.
   * @param {string} queryOpts.pageProvider - The page provider name to execute. `query` or `pageProvider` must be set.
   * @param {array} [queryOpts.queryParams] - Ordered parameters for the query or page provider.
   * @param {number} [queryOpts.pageSize=0] - The number of results per page.
   * @param {number} [queryOpts.currentPageIndex=0] - The current page index.
   * @param {number} [queryOpts.maxResults] - The expected max results.
   * @param {string} [queryOpts.sortBy] - The sort by info.
   * @param {string} [queryOpts.sortOrder] - The sort order info.
   * @param {object} [opts] - Options overriding the ones from this object.
   * @returns {Promise} A Promise object resolved with the response where the entries are replaced
   *                    with Document objetcs.
   */
  query(queryOpts: any = {}, opts: any = {}): Observable<NuxeoResponse> {
    const options = this._computeOptions(opts);
    const path = this._computeQueryPath(queryOpts);
    options.repository = this;
    return this._nuxeo.request(path).queryParams(queryOpts).get(options);
  }

  _computeQueryPath(queryOpts: any = {}): string {
    const { serverVersion } = this._nuxeo;
    const isSearchEndPoint = serverVersion && serverVersion.gte(ServerVersion.LTS_2016);
    const path = isSearchEndPoint
      ? join('search', queryOpts.query ? 'lang/NXQL' : `pp/${queryOpts.pageProvider}`, 'execute')
      : join('query', queryOpts.query ? 'NXQL' : queryOpts.pageProvider);
    return path;
  }
}
