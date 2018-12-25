import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NUXEO_ENV } from './nuxeo.options';
import { Nuxeo } from './lib/nuxeo.api';
import { Observable } from 'rxjs';
import { Md5 } from 'ts-md5/dist/md5';
import { map, mergeMap } from 'rxjs/operators';
import { DeviceDetectorService } from 'ngx-device-detector';

import {
  NuxeoRequestOptions,
  NuxeoOptions,
  Credentials,
  Operation,
  Repository,
  Request,
  Directory,
  UserModel,
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

  getUser(username: string): Observable<UserModel> {
    return this.nuxeo.users({ enrichers: { user: ['userprofile'] } }).fetch(username);
  }

  setCredentials(credentials: Credentials): Nuxeo {
    return this.nuxeo.setCredentials(credentials);
  }

  login(username: string, password: string): Observable<Credentials> {
    this.credentials['username'] = username;
    return this.setCredentials({ method: 'basic', username: username, password: password }).connect().pipe(
      mergeMap(response => this.requestAuthenticationToken()),
    );
  }

  loginAutomatically(): Observable<Credentials> {
    return this.setCredentials({ method: 'basic' }).connect();
  }

  loginWithToken(token: string): Observable<any> {
    this.credentials['token'] = token;
    return this.setCredentials({ method: 'token', token: token }).login();
  }

  authenticate(credentials: Credentials): Observable<Credentials> {
    return this.setCredentials(credentials).connect();
  }

  isAuthenticated(): boolean {
    return this.nuxeo.connected;
  }

  requestAuthenticationToken(): Observable<Credentials> {
    return this.nuxeo.requestAuthenticationToken(this.env.appName, this.getDeviceId(), this.deviceService.device, 'r', { json: false }).pipe(
      map(token => {
        this.credentials['token'] = token;
        return this.credentials;
      }));
  }

  pageProvider(url: string, queryParams: any = {}, opts: NuxeoRequestOptions): Observable<NuxeoPagination> {
    return this.request(url, opts).queryParams(queryParams).schemas(opts.schemas).execute().pipe(
      map(res => new NuxeoPagination(res)),
    );
  }

  operation(id: string, opts: any = {}): Operation {
    return this.nuxeo.operation(id, opts);
  }

  request(path: string, opts: NuxeoRequestOptions): Request {
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
