import { join } from './nuxeo.helpers';

const API_PATH = 'api/v1/';

export abstract class AbstractCore {
  opts: any;
  baseUrl: string = '';
  apiPath: string;
  restUrl: string;
  operationUrl: string;
  automationUrl: string;
  baseOptions: any = {};
  httpClient: any;

  constructor(opts: NuxeoOptions) {
    this.apiPath = API_PATH;
    this.baseUrl = opts.baseUrl;
    this.restUrl = join(this.baseUrl, this.apiPath);
    this.automationUrl = join(this.restUrl, 'automation/');
  }

  getConfigs(): object {
    return {
      baseUrl: this.baseUrl,
      restUrl: this.restUrl,
      httpClient: this.httpClient,
      baseOptions: this.baseOptions,
      automationUrl: this.automationUrl,
    };
  }
}

export class LoginContext {
  username: string;
  password: string;
}

export class Credentials {
  clientId?: string;
  secret?: string;
  token?: any;
  username?: string;
  password?: string;
  method: string;
}

export class User {
  username: string;
}

export class AuthenticationToken {
  access_token: any;
}

export class NuxeoOptions {
  baseUrl: string = '';
  auth: Credentials;
  production: boolean;
  deviceUID: string;
  deviceName: string;
  appName: string;
}

export class Authentication {
  opts?: any;
}

export class NuxeoOperation {
  opts?: any;
  http: any;
}

export class NuxeoResponse {
  data: any;
}

export class Document {
  id: string;
  xPath: string;
  properties: any;
}
