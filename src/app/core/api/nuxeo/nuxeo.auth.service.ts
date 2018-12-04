import { Inject, Injectable, InjectionToken, Injector, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Logger } from '@core/utils/logger.service';
import { Observable, of as observableOf } from 'rxjs';
import { Nuxeo } from './lib/nuxeo.api';
import { NUXEO_ENV, NuxeoConfigs, Credentials } from './nuxeo.options';

const log = new Logger('NuxeoAuthService');

@Injectable()
export class NuxeoAuthService {

  private _nuxeo: Nuxeo;
  private _connected: false;
  private credentials: any = {};

  constructor(private httpClient: HttpClient, @Inject(NUXEO_ENV) private env: NuxeoConfigs) {
    this._nuxeo = new Nuxeo(httpClient);
  }

  get nuxeo(): Nuxeo {
    return this._nuxeo;
  }

  login(username: string, password: string): Observable<any> {
    this.credentials['username'] = username;
    return this._nuxeo.setCredentials({ method: 'basic', username: username, password: password }).login();
  }

  authenticate(credentials: Credentials): Observable<any> {
    return this._nuxeo.setCredentials(credentials).connect();
  }

  isAuthenticated(): boolean {
    return this._connected;
  }

  requestAuthenticationToken(): Observable<Credentials> {
    this._nuxeo.requestAuthenticationToken(this.env.appName, this.env.appName, '', 'r').subscribe(
      token => { this.credentials['token'] = token; },
    );
    return observableOf(this.credentials);
  }

}
