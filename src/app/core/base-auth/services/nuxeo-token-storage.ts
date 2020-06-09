import { Injectable } from '@angular/core';
import { CookieService } from '../../services';
import { NbTokenStorage, NbAuthTokenParceler, NbAuthToken } from '../services';

@Injectable()
export class NuxeoTokenStorage extends NbTokenStorage {

  protected key = 'knowledge_token';

  constructor(private parceler: NbAuthTokenParceler, private cookieService: CookieService) {
    super();
  }

  get(): NbAuthToken {
    const raw = this.cookieService.get(this.key);
    return this.parceler.unwrap(raw);
  }

  set(token: NbAuthToken) {
    const raw = this.parceler.wrap(token);
    this.cookieService.set(this.key, raw, token.getTokenExpDate(), '/', undefined, true, 'Lax');
  }

  clear() {
    this.cookieService.deleteAll();
  }
}
