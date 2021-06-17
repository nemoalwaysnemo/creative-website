import { Injectable } from '@angular/core';
import { CookieService } from '../../services';
import { NbTokenStorage, NbAuthTokenParceler, NbAuthToken } from '../services';

@Injectable()
export class NuxeoTokenStorage extends NbTokenStorage {

  protected key = 'knowledgeToken';

  constructor(private parceler: NbAuthTokenParceler, private cookieService: CookieService) {
    super();
  }

  get(): NbAuthToken {
    const raw = this.cookieService.get(this.key);
    return this.parceler.unwrap(raw);
  }

  set(token: NbAuthToken): void {
    const raw = this.parceler.wrap(token);
    this.cookieService.set(this.key, raw, 10, '/', undefined, true, 'None');
  }

  clear(): void {
    this.cookieService.deleteAll();
  }
}
