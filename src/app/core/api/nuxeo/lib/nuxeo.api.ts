import { HttpClient } from '@angular/common/http';
import {
  Base,
  AuthenticationManager,
  Credentials,
  Repository,
  Operation,
  Directory,
  Request,
  Users,
  ServerVersion,
  NuxeoOptions,
  NuxeoResponse,
} from './';
import {
  Unmarshallers,
  DocumentUnmarshaller,
  DocumentsUnmarshaller,
  UserUnmarshaller,
  DirectoryEntryUnmarshaller,
  DirectoryEntriesUnmarshaller,
} from './nuxeo.unmarshallers';
import { Observable } from 'rxjs';
import { tap, map, mergeMap } from 'rxjs/operators';
import { deepExtend } from './nuxeo.helpers';


export class Nuxeo extends Base {

  private auth: Credentials;
  private _connected: boolean = false;
  private _serverVersion: ServerVersion;
  private _nuxeoVersion: string;

  constructor(protected httpClient: HttpClient, protected opts: NuxeoOptions) {
    super(opts);
    this.auth = opts.auth;
    this.httpClient = httpClient;
    // register default unmarshallers
    this._initUnmarshaller();
  }

  get connected(): boolean {
    return this._connected;
  }

  get serverVersion(): ServerVersion {
    return this._serverVersion;
  }

  get nuxeoVersion(): string {
    return this._nuxeoVersion;
  }

  setCredentials(credentials: Credentials): this {
    this.auth = credentials;
    return this;
  }

  cmis(opts: any = {}): Observable<any> {
    let finalOptions = { method: 'GET', url: this.baseUrl + 'json/cmis' };
    finalOptions = Object.assign(finalOptions, opts);
    finalOptions = this._computeOptions(finalOptions);
    return this.http(finalOptions);
  }

  connect(opts: any = {}): Observable<any> {
    return this.cmis(opts).pipe(
      tap(res => {
        if (res && res.default && res.default.productVersion) {
          this._serverVersion = new ServerVersion(res.default.productVersion);
          this._nuxeoVersion = res.default.productVersion;
        }
      }),
      mergeMap(res => this.login(opts)),
      // mergeMap(res => this.users({ enrichers: { user: ['userprofile'] } }).fetch(res.username)),
      tap(res => { this._connected = true; }),
    );
  }

  login(opts: any = {}): Observable<any> {
    let finalOptions = { method: 'POST', url: this.automationUrl + 'login' };
    finalOptions = Object.assign(finalOptions, opts);
    finalOptions = this._computeOptions(finalOptions);
    return this.http(finalOptions);
  }

  users(opts: any = {}): Users {
    const finalOptions = this._computeOptions(Object.assign({ nuxeo: this }, opts));
    return new Users(finalOptions);
  }

  authenticate(data?: any): Observable<NuxeoResponse> {
    return;
  }

  operation(id: string, opts: any = {}): Operation {
    const finalOptions = this._computeOptions(Object.assign({ nuxeo: this, id }, opts));
    return new Operation(finalOptions);
  }

  request(path: string, opts: any = {}) {
    const finalOptions = this._computeOptions(Object.assign({ nuxeo: this, path, url: this.restUrl }, opts));
    return new Request(finalOptions);
  }

  directory(name: string, opts: any) {
    const finalOptions = this._computeOptions(Object.assign({ nuxeo: this, directoryName: name }, opts));
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
    finalOptions = Object.assign({}, finalOptions, options);
    finalOptions = this._computeOptions(finalOptions);
    return new Repository(finalOptions);
  }

  requestAuthenticationToken(applicationName: string, deviceId: string, deviceDescription: string, permission: string, opts: any = {}): Observable<any> {
    let finalOptions = {
      url: this.baseUrl + 'authentication/token',
      queryParams: { applicationName, deviceId, deviceDescription, permission },
    };
    finalOptions = this._computeOptions(Object.assign(finalOptions, opts));
    return this.http(finalOptions);
  }

  http(opts: any = {}): Observable<any> {
    const options = this._computeFetchOptions(opts);
    return this.httpClient.request(options.method, options.url, {
      headers: options.headers,
      body: options.body,
      params: options.queryParams,
      responseType: options.json ? 'json' : 'text',
    }).pipe(
      map((response) => {
        options.nuxeo = this;
        return Unmarshallers.unmarshall(response, options);
      }),
    );
  }

  private _computeFetchOptions(opts: any = {}) {
    let options: any = {
      method: 'GET',
      headers: {},
      json: true,
      timeout: 30000,
      cache: false,
      resolveWithFullResponse: false,
    };
    options = Object.assign({}, options, opts);
    const authenticationHeaders = AuthenticationManager.computeAuthenticationHeaders(this.auth);
    options.headers = Object.assign({}, options.headers, authenticationHeaders);

    if (options.schemas && options.schemas.length > 0) {
      options.headers.properties = options.schemas.join(',');
    }
    if (opts.repositoryName !== undefined && opts.repositoryName !== null) {
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
    } else {
      options.headers.Accept = 'text/plain';
      options.headers['Content-Type'] = 'text/plain';
    }

    if (options.method === 'GET') {
      delete options.headers['Content-Type'];
    }

    if (options.queryParams && Object.keys(options.queryParams).length > 0) {
      options.url += options.url.indexOf('?') === -1 ? '?' : '';
      options.url += JSON.stringify(options.queryParams);
    }
    return options;
  }

  private _computeTimeouts(options?: any): any {
    const transactionTimeout = options.transactionTimeout || options.timeout;
    let httpTimeout = options.httpTimeout;
    if (!httpTimeout && transactionTimeout) {
      // make the http timeout a bit longer than the transaction timeout
      httpTimeout = 5 + transactionTimeout;
    }
    return { httpTimeout, transactionTimeout };
  }

  private _initUnmarshaller(): void {
    this._registerUnmarshaller('user', UserUnmarshaller);
    this._registerUnmarshaller('document', DocumentUnmarshaller);
    this._registerUnmarshaller('documents', DocumentsUnmarshaller);
    this._registerUnmarshaller('directoryEntry', DirectoryEntryUnmarshaller);
    this._registerUnmarshaller('directoryEntries', DirectoryEntriesUnmarshaller);
  }

  private _registerUnmarshaller(entityType: any, unmarshaller: any): void {
    Unmarshallers.registerUnmarshaller(entityType, unmarshaller);
  }
}
