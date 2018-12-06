import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of as observableOf, pipe } from 'rxjs';
import { NUXEO_ENV, NuxeoOptions, Credentials } from './nuxeo.options';
import { Nuxeo } from './lib/nuxeo.api';
import { map } from 'rxjs/operators';

@Injectable()
export class NuxeoAuthService {

  private _nuxeo: Nuxeo;
  private credentials: Credentials = {};

  constructor(private httpClient: HttpClient, @Inject(NUXEO_ENV) private env: NuxeoOptions) {
    this._nuxeo = this.newInstance(httpClient, env);
  }

  get nuxeo(): Nuxeo {
    return this._nuxeo;
  }

  private newInstance(httpClient: HttpClient, env: NuxeoOptions): Nuxeo {
    return new Nuxeo(httpClient, env);
  }

  login(username: string, password: string): Observable<any> {
    this.credentials['username'] = username;
    return this.nuxeo.setCredentials({ method: 'basic', username: username, password: password }).connect();
  }

  loginWithToken(token: string): Observable<any> {
    this.credentials['token'] = token;
    return this.nuxeo.setCredentials({ method: 'token', token: token }).login();
  }

  authenticate(credentials: Credentials): Observable<Credentials> {
    return this.nuxeo.setCredentials(credentials).connect();
  }

  isAuthenticated(): boolean {
    return this.nuxeo.connected;
  }

  requestAuthenticationToken(): Observable<Credentials> {
    return this.nuxeo.requestAuthenticationToken(this.env.appName, this.env.deviceUID, this.env.deviceName, 'r', { json: false }).pipe(
      map(token => {
        this.credentials['toke'] = token;
        return this.credentials;
      }));
  }

}
