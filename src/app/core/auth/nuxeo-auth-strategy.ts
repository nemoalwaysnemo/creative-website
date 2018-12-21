import { Injectable } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  NbAuthStrategy,
  NbAuthStrategyClass,
  NbAuthStrategyOptions,
  NbAuthResult,
} from '../nebular/auth';
import { NuxeoApiService, Credentials } from '../api/nuxeo';
import { NuxeoAuthToken } from './nuxeo-auth-token';


@Injectable()
export class NuxeoAuthStrategy extends NbAuthStrategy {

  constructor(protected nuxeoApi: NuxeoApiService) {
    super();
  }

  static setup(options: NbAuthStrategyOptions): [NbAuthStrategyClass, NbAuthStrategyOptions] {
    return [NuxeoAuthStrategy, options];
  }

  authenticate(credentials: any): Observable<NbAuthResult> {
    return this.nuxeoApi.login(credentials.email, credentials.password).pipe(
      map((res: Credentials) => this.getNbAuthResult(res)),
    );
  }

  register(data?: any): Observable<NbAuthResult> {
    return observableOf(new NbAuthResult(false));
  }

  requestPassword(data?: any): Observable<NbAuthResult> {
    return observableOf(new NbAuthResult(false));
  }

  resetPassword(data: any = {}): Observable<NbAuthResult> {
    return observableOf(new NbAuthResult(false));
  }

  logout(): Observable<NbAuthResult> {
    return observableOf(new NbAuthResult(false));
  }

  refreshToken(data?: any): Observable<NbAuthResult> {
    return this.nuxeoApi.loginWithToken(data.token).pipe(
      map((res: Credentials) => this.getNbAuthResult(res)),
    );
  }

  private getNbAuthResult(credentials: Credentials): NbAuthResult {
    const token = new NuxeoAuthToken(Object.assign({}, credentials, { expiresIn: 3600 * 2 }));
    return new NbAuthResult(true, {}, null, [], [], token);
  }

}
