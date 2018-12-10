import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NUXEO_ENV } from './nuxeo.options';
import { Nuxeo } from './lib/nuxeo.api';
import { Observable } from 'rxjs';
import { Md5 } from 'ts-md5/dist/md5';
import { map, mergeMap } from 'rxjs/operators';
import { DeviceDetectorService } from 'ngx-device-detector';

import {
  NuxeoAPIProps,
  NuxeoOptions,
  Credentials,
  Operation,
  Repository,
  Request,
  Directory,
  NuxeoPagination,
} from './lib';

@Injectable()
export class NuxeoApiService {

  private _nuxeo: Nuxeo;
  private credentials: Credentials = {};

  constructor(private httpClient: HttpClient, @Inject(NUXEO_ENV) private env: NuxeoOptions, private deviceService: DeviceDetectorService) {
    this._nuxeo = new Nuxeo(httpClient, env);
  }

  get nuxeo(): Nuxeo {
    return this._nuxeo;
  }

  getConfigs(): NuxeoAPIProps {
    return this.nuxeo.getConfigs();
  }

  login(username: string, password: string): Observable<Credentials> {
    this.credentials['username'] = username;
    return this.nuxeo.setCredentials({ method: 'basic', username: username, password: password }).connect().pipe(
      mergeMap(response => this.requestAuthenticationToken()),
    );
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
    return this.nuxeo.requestAuthenticationToken(this.env.appName, this.getDeviceId(), this.deviceService.device, 'r', { json: false }).pipe(
      map(token => {
        this.credentials['toke'] = token;
        return this.credentials;
      }));
  }

  pageProvider(url: string, queryParams: any = {}, opts: any = { schemas: ['*'] }): Observable<NuxeoPagination> {
    return this.request(url).queryParams(queryParams).schemas(opts.schemas).execute().pipe(
      map(res => new NuxeoPagination(res)),
    );
  }

  operation(id: string, opts: any = {}): Operation {
    return this.nuxeo.operation(id, opts);
  }

  request(path: string, opts: any = {}): Request {
    return this.nuxeo.request(path, opts);
  }

  repository(name?: string, opts: any = {}): Repository {
    return this.nuxeo.repository(name, opts);
  }

  directory(path: string, opts: any = {}): Directory {
    return this.nuxeo.directory(path, opts);
  }

  private getDeviceId(): string {
    const deviceInfo = this.deviceService.getDeviceInfo();
    return btoa(Md5.hashStr(JSON.stringify(deviceInfo)).toString());
  }
}
