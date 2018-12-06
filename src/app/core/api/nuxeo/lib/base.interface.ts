import { join } from './nuxeo.helpers';

const API_PATH = 'api/v1/';

export abstract class AbstractCore {
  protected opts: any;
  protected baseUrl: string = '';
  protected apiPath: string;
  protected restUrl: string;
  protected automationUrl: string;
  protected baseOptions: any = {};

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
      baseOptions: this.baseOptions,
      automationUrl: this.automationUrl,
    };
  }
}

export class Credentials {
  clientId?: string;
  secret?: string;
  token?: any;
  username?: string;
  password?: string;
  method?: string;
}

export class UserModel {
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

export class DocumentModel {
  id: string;
  xPath: string;
  properties: any;
}

export class NuxeoResponse {
  private entityType: string;
  private entity: any;
  private entities: any;
  private resultsCount: number;
  private pageSize: number;
  private currentPageSize: number;
  private currentPageIndex: number;
  private numberOfPages: number;

  constructor(response: any = {}) {
    this.entityType = response.entity_type;
    this.entity = response.entity || {};
    this.entities = response.entities || [];
    this.resultsCount = response.resultsCount || 0;
    this.pageSize = response.pageSize || 0;
    this.currentPageSize = response.currentPageSize || 0;
    this.currentPageIndex = response.currentPageIndex || 0;
    this.numberOfPages = response.numberOfPages || 0;
  }

  getEntityType(): string {
    return this.entityType;
  }

  getEntity(): any {
    return this.entity;
  }

  getEntities(): any {
    return this.entities;
  }

  getResultsCount(): number {
    return this.resultsCount;
  }

  getPageSize(): number {
    return this.pageSize;
  }

  getCurrentPageSize(): number {
    return this.currentPageSize;
  }

  getCurrentPageIndex(): number {
    return this.currentPageIndex;
  }

  getNumberOfPages(): number {
    return this.numberOfPages;
  }
}
