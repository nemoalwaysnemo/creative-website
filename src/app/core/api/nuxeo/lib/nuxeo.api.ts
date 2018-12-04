import { NuxeoOptions, NuxeoResponse } from './base.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Credentials } from './base.interface';
import { map } from 'rxjs/operators';
import { Base } from './base.api';
import { BaseAuthentication } from './base.authentication';
import { Operation } from './nuxeo.operation';
import { Directory } from './nuxeo.directory';
import { Request } from './nuxeo.request';
import { Users } from './nuxeo.users';
import { Repository } from './nuxeo.repository';

import { Unmarshallers, documentUnmarshaller, documentsUnmarshaller, userUnmarshaller } from './nuxeo.unmarshallers';

export class Nuxeo extends Base {

  private _promiseLibrary: any;
  private _authenticationRefreshedListeners: Array<any>;
  private _activeRequests: 0;
  private auth: Credentials;
  private _connected: false;
  documentUnmarshaller: any;

  constructor(httpClient: HttpClient, opts: NuxeoOptions = { baseUrl: '' }) {
    super(opts);
    this.auth = opts.auth;
    this.httpClient = httpClient;
    // register default unmarshallers
    this._initUnmarshaller();
  }

  get connected(): boolean {
    return this._connected;
  }

  setCredentials(credentials: Credentials): this {
    this.auth = credentials;
    return this;
  }

  cmis(opts?: any): Observable<any> {
    let finalOptions = { method: 'GET', url: this.baseUrl + 'json/cmis' };
    finalOptions = Object.assign(finalOptions, opts);
    finalOptions = this._computeOptions(finalOptions);
    return this.http(finalOptions);
  }

  connect(opts?: any): Observable<any> {

    // this.cmis().subscribe(
    //   response => {
    //     this.login();
    //     // console.log(response);
    //     // this.users({ enrichers: { user: ['userprofile'] } }).fetch(response.username);
    //     console.log('POST call successful value returned in body', response);
    //   },
    //   error => {
    //     if (error.status === 401) {
    //       this.login();
    //       console.log('POST call in error', error);
    //     }
    //   });
    return this.cmis();
  }

  login(opts?: any): Observable<any> {
    let finalOptions = { method: 'POST', url: this.automationUrl + 'login' };
    finalOptions = Object.assign(finalOptions, opts);
    finalOptions = this._computeOptions(finalOptions);
    return this.http(finalOptions);
  }

  users(opts: any = {}): Users {
    const finalOptions = this._computeOptions(Object.assign(this.getConfigs(), opts));
    return new Users(finalOptions);
  }

  authenticate(data?: any): Observable<NuxeoResponse> {
    return;
  }

  operation(id: string, opts?: {}): Operation {
    let finalOptions = {
      id,
      url: this.automationUrl,
      httpService: this,
    };
    finalOptions = this._computeOptions(Object.assign(finalOptions, opts));
    return new Operation(finalOptions);
  }

  request(path: string, opts?: {}) {
    let finalOptions = {
      path,
      nuxeo: this,
      url: this.restUrl,
    };
    finalOptions = this._computeOptions(Object.assign(finalOptions, opts));
    return new Request(finalOptions);
  }

  directory(name: string, opts: any) {
    let finalOptions = {
      directoryName: name,
      nuxeo: this,
    };
    finalOptions = this._computeOptions(Object.assign(finalOptions, opts));
    return new Directory(finalOptions);
  }

  repository(name: string = null, opts: any = {}) {
    let repositoryName = name;
    let options = opts;
    if (typeof repositoryName === 'object') {
      options = repositoryName;
      repositoryName = null;
    }

    let finalOptions = {
      nuxeo: this,
      repositoryName,
    };
    if (repositoryName) {
      finalOptions.repositoryName = repositoryName;
    }
    // finalOptions = Object.assign(finalOptions, options);
    finalOptions = Object.assign(options, finalOptions);
    finalOptions = this._computeOptions(finalOptions);

    return new Repository(finalOptions);
  }

  requestAuthenticationToken(applicationName: string,
    deviceId: string, deviceDescription: string, permission: string, opts?: any): Observable<any> {
    let finalOptions = {
      url: this.baseUrl + 'authentication/token',
      queryParams: { applicationName, deviceId, deviceDescription, permission },
    };
    finalOptions = this._computeOptions(Object.assign(finalOptions, opts));
    return this.http(finalOptions);
  }

  http(opts?: any): Observable<any> {
    const options = this._computeFetchOptions(opts);
    return this.httpClient.request(options.method, options.url, {
      headers: options.headers,
      body: options.body,
      params: options.queryParams,
    }).pipe(
      map((json) => {
        options.nuxeo = this;
        return Unmarshallers.unmarshall(json, options);
      }),
    );
  }


  _computeFetchOptions(opts?: any) {
    let options: any = {
      method: 'GET',
      headers: {},
      json: true,
      timeout: 30000,
      cache: false,
      resolveWithFullResponse: false,
    };
    options = Object.assign({}, options, opts);
    const authenticationHeaders = BaseAuthentication.computeAuthenticationHeaders(this.auth);
    options.headers = Object.assign(options.headers, authenticationHeaders);

    if (options.schemas && options.schemas.length > 0) {
      options.headers.properties = options.schemas.join(',');
    }
    if (opts.repositoryName !== undefined) {
      options.headers['X-NXRepository'] = options.repositoryName;
    }

    if (opts.enrichers) {
      Object.keys(opts.enrichers).forEach((key) => {
        options.headers[`enrichers-${key}`] = options.enrichers[key].join(',');
      });
    }

    if (opts.fetchProperties) {
      Object.keys(opts.fetchProperties).forEach((key) => {
        options.headers[`fetch-${key}`] = options.fetchProperties[key].join(',');
      });
    }

    if (opts.translateProperties) {
      Object.keys(opts.translateProperties).forEach((key) => {
        options.headers[`translate-${key}`] = options.translateProperties[key].join(',');
      });
    }

    if (options.depth) {
      options.headers.depth = options.depth;
    }

    const { httpTimeout, transactionTimeout } = this._computeTimeouts(options);
    if (transactionTimeout) {
      options.headers['Nuxeo-Transaction-Timeout'] = transactionTimeout;
    }
    options.timeout = httpTimeout;

    if (options.json) {
      options.headers.Accept = 'application/json';
      options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
      // do not stringify FormData
      if (typeof options.body === 'object' && !(options.body instanceof FormData)) {
        options.body = JSON.stringify(options.body);
      }
    }

    if (options.method === 'GET') {
      delete options.headers['Content-Type'];
    }

    // if (options.queryParams && Object.keys(options.queryParams).length > 0) {
    //   options.url += options.url.indexOf('?') === -1 ? '?' : '';
    //   options.url += JSON.stringify(options.queryParams);
    // }
    return options;
  }

  _computeTimeouts(options?: any): any {
    const transactionTimeout = options.transactionTimeout || options.timeout;
    let httpTimeout = options.httpTimeout;
    if (!httpTimeout && transactionTimeout) {
      // make the http timeout a bit longer than the transaction timeout
      httpTimeout = 5 + transactionTimeout;
    }
    return { httpTimeout, transactionTimeout };
  }

  _initUnmarshaller(): void {
    this._registerUnmarshaller('user', userUnmarshaller);
    this._registerUnmarshaller('document', documentUnmarshaller);
    this._registerUnmarshaller('documents', documentsUnmarshaller);
  }

  _registerUnmarshaller(entityType: any, unmarshaller: any): void {
    Unmarshallers.registerUnmarshaller(entityType, unmarshaller);
  }
}
