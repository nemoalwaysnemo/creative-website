import { join } from './nuxeo.helpers';
import { NuxeoResponse } from './base.interface';
import { Observable } from 'rxjs';
import { Base } from './base.api';

export class Users extends Base {

  operationUrl: 'user';

  fetch(username: string, opts?: any): Observable<NuxeoResponse> {
    const options = this._computeOptions(opts);
    options.users = this;
    const path = join(this.operationUrl, username);
    return this.httpClient.request(path).get(options);
  }
}
