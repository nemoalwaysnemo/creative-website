import { Injectable } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  NbAuthStrategy,
  NbAuthStrategyClass,
  NbAuthStrategyOptions,
  NbAuthResult,
} from '../nebular/auth';
import { NuxeoApiService, Credentials } from '../api/nuxeo';
import { NuxeoAuthToken } from './nuxeo-auth-token';
import { Environment } from '@environment/environment';
import { UserModel } from '@core/api';


@Injectable()
export class NuxeoAuthStrategy extends NbAuthStrategy {

  private tokenExpiresIn: number = 3600 * 4;

  constructor(protected nuxeoApi: NuxeoApiService) {
    super();
  }

  static setup(options: NbAuthStrategyOptions): [NbAuthStrategyClass, NbAuthStrategyOptions] {
    return [NuxeoAuthStrategy, options];
  }

  authenticate(credentials: any = {}): Observable<NbAuthResult> {
    if (credentials.autoLogin) {
      return this.nuxeoApi.loginAutomatically().pipe(
        map((user: UserModel) => this.getNbAuthUseresult(user)),
      );
    } else {
      return this.nuxeoApi.login(credentials.email, credentials.password).pipe(
        map((res: Credentials) => this.getNbAuthTokenResult(res)),
      );
    }
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

  refreshToken(credentials?: any): Observable<NbAuthResult> {
    return observableOf(this.getNbAuthTokenResult(credentials));
  }

  private getNbAuthUseresult(user: UserModel): NbAuthResult {
    const credentials = new Credentials({ method: 'basic', username: user.username });
    const token = new NuxeoAuthToken(Object.assign({}, credentials, { expiresIn: this.tokenExpiresIn }));
    return this.getNbAuthResult(token);
  }

  private getNbAuthTokenResult(credentials: Credentials): NbAuthResult {
    const token = new NuxeoAuthToken(Object.assign({}, credentials, { expiresIn: this.tokenExpiresIn }));
    return this.getNbAuthResult(token);
  }

  private getNbAuthResult(token: NuxeoAuthToken): NbAuthResult {
    return new NbAuthResult(true, {}, [Environment.homePath], [], [], token);
  }

}
