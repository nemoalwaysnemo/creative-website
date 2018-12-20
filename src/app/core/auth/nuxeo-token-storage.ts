import { Injectable } from '@angular/core';
import { NuxeoAuthToken } from './nuxeo-auth-token';
import { CookieService } from 'ngx-cookie-service';
import { NbAuthToken, NbTokenStorage, NbAuthTokenParceler } from '../nebular/auth';

@Injectable()
export class NuxeoTokenStorage extends NbTokenStorage {

  protected key = 'gcl_nuxeo_token';

  constructor(private parceler: NbAuthTokenParceler, private cookieService: CookieService) {
    super();
  }

  get(): NbAuthToken {
    const raw = this.cookieService.get(this.key);
    return this.parceler.unwrap(raw);
  }

  set(token: NuxeoAuthToken) {
    const raw = this.parceler.wrap(token);
    this.cookieService.set(this.key, raw, token.getTokenExpDate());
  }

  clear() {
    this.cookieService.deleteAll();
  }
}
