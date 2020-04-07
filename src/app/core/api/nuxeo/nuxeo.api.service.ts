import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NUXEO_ENV } from './nuxeo.options';
import { Nuxeo } from './lib/nuxeo.api';
import { Observable, Subject } from 'rxjs';
import { Md5 } from 'ts-md5/dist/md5';
import { map, mergeMap, tap } from 'rxjs/operators';
import { DeviceDetectorService } from 'ngx-device-detector';

import {
  NuxeoRequestOptions,
  NuxeoApiOptions,
  Credentials,
  Repository,
  Request,
  UserModel,
  NuxeoPagination,
  BatchUpload,
  DirectoryEntry,
  NuxeoResponse,
} from './lib';

@Injectable()
export class NuxeoApiService {

  private _nuxeo: Nuxeo;

  private _currentUser: Subject<UserModel> = new Subject<UserModel>();

  private credentials: Credentials = {};

  constructor(private httpClient: HttpClient, @Inject(NUXEO_ENV) readonly apiOpts: NuxeoApiOptions, private deviceService: DeviceDetectorService) {
    this._nuxeo = new Nuxeo(httpClient, apiOpts);
  }

  get nuxeo(): Nuxeo {
    return this._nuxeo;
  }

  get currentUser(): Observable<UserModel> {
    return this._currentUser;
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
      tap((user: UserModel) => { this._currentUser.next(user); }),
      mergeMap(response => this.requestAuthenticationToken()),
    );
  }

  loginAutomatically(): Observable<UserModel> {
    return this.setCredentials({ method: 'basic' }).connect().pipe(
      tap((user: UserModel) => { this._currentUser.next(user); }),
    );
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
    return this.nuxeo.requestAuthenticationToken(this.apiOpts.appName, this.getDeviceId(), this.deviceService.device, 'r', { json: false }).pipe(
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

  batchUpload(opts: any = {}): BatchUpload {
    return this.nuxeo.batchUpload(opts);
  }

  operation(id: string, params: any = {}, input: string = null, opts: any = null): Observable<any> {
    const op = this.nuxeo.operation(id, opts || {});
    return input ? op.input(input).params(params).execute() : op.params(params).execute();
  }

  request(path: string, opts: NuxeoRequestOptions): Request {
    return this.nuxeo.request(path, opts);
  }

  repository(name?: string, opts: any = {}): Repository {
    return this.nuxeo.repository(name, opts);
  }

  directory(directoryName: string, opts: any = {}): Observable<DirectoryEntry[]> {
    return this.nuxeo.directory(directoryName, opts).fetchAll();
  }

  private getDeviceId(): string {
    const deviceInfo = this.deviceService.getDeviceInfo();
    return btoa(Md5.hashStr(JSON.stringify(deviceInfo)).toString());
  }
}
