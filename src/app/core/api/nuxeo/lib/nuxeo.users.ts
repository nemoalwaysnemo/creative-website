import { join } from './nuxeo.helpers';
import { NuxeoResponse } from './base.interface';
import { Observable } from 'rxjs';
import { Base } from './base.api';

export class Users extends Base {

  private operationUrl: string = 'user';

  constructor(opts: any = {}) {
    super(opts);
    this._nuxeo = opts.nuxeo;
  }

  fetch(username: string, opts: any = {}): Observable<NuxeoResponse> {
    const options = this._computeOptions(opts);
    options.users = this;
    const path = join(this.operationUrl, username);
    return this._nuxeo.request(path).get(options);
  }
}
