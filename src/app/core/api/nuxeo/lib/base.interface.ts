import { join } from './nuxeo.helpers';

export interface Core {
  baseUrl: string;
  apiPath: string;
  restUrl: string;
  automationUrl: string;
  baseOptions: any;
}

const API_PATH = 'api/v1/';
const BASE_URL = 'http://localhost:8080/nuxeo/';

export abstract class AbstractCore implements Core {

  opts: any;
  baseUrl: string;
  apiPath: string;
  restUrl: string;
  operationUrl: string;
  automationUrl: string;
  baseOptions: any = {};
  httpClient: any;

  constructor(opts: NuxeoOptions = { baseUrl: BASE_URL }) {
    this.baseUrl = opts.baseUrl;
    this.apiPath = API_PATH;
    this.restUrl = join(this.baseUrl, this.apiPath);
    this.automationUrl = join(this.restUrl, 'automation/');
  }

  getConfigs(): any {
    return {
      baseUrl: this.baseUrl,
      restUrl: this.restUrl,
      httpClient: this.httpClient,
      baseOptions: this.baseOptions,
      automationUrl: this.automationUrl,
    };
  }
}

export interface Credentials {
  clientId?: string;
  secret?: string;
  token?: any;
  username: string;
  password?: string;
  method: string;
}

export interface User {
  username: string;
}

export interface AuthenticationToken {
  access_token: any;
}

export interface NuxeoOptions {
  baseUrl?: string;
  auth?: any;
}

export interface NuxeoConfigs {
  production: boolean;
  serverUrl: string;
  appName: string;
}

export interface Authentication {
  opts?: any;
}

export interface NuxeoOperation {
  opts?: any;
  http: any;
}

export interface NuxeoResponse {
  data: any;
}

export interface Document {
  id: string;
  xPath: string;
  properties: any;
}
