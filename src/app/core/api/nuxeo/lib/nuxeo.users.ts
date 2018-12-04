import { join, encodePath } from './nuxeo.helpers';
import { NuxeoOptions, NuxeoResponse } from './base.interface';
import { Observable, of as observableOf } from 'rxjs';
import { Base } from './base.api';

export class Users extends Base {

  operationUrl: 'user';

  fetch(username: string, opts?: any): Observable<NuxeoResponse>  {
    const options = this._computeOptions(opts);
    options.users = this;
    const path = join(this.operationUrl, username);
    return this.httpClient.request(path).get(options);
  }
}
