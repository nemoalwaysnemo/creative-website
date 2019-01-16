import { join } from '../../../services';
import { UserModel } from './nuxeo.user-model';
import { Observable } from 'rxjs';
import { Base } from './base.api';

export class Users extends Base {

  private operationUrl: string = 'user';

  constructor(opts: any = {}) {
    super(opts);
    this._nuxeo = opts.nuxeo;
  }

  fetch(username: string, opts: any = {}): Observable<UserModel> {
    const options = this._computeOptions(opts);
    const path = join(this.operationUrl, username);
    options.users = this;
    return this._nuxeo.request(path).get(options);
  }
}
