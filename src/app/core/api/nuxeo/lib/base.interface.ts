import { join } from './nuxeo.helpers';
import { DocumentModel } from './nuxeo.document-model';

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

  getConfigs(): {} {
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

export class AuthenticationToken {
  access_token: any;
}

export class AggregateModel {
  readonly id: string;
  readonly entityType: string;
  readonly buckets: {}[];
  readonly extendedBuckets: {}[];
  readonly ranges: {}[];
  readonly selection: [];
  readonly properties: {};
  readonly field: string;
  readonly type: string;

  constructor(data: any = {}) {
    this.entityType = data['entity-type'];
    Object.assign(this, data);
  }
}

export class NuxeoOptions {
  baseUrl: string = '';
  auth?: Credentials;
  production: boolean;
  appName: string;
}

export class NuxeoResponse {
  [key: string]: any;
}

export class NuxeoPageProviderParams {
  [key: string]: any;
  currentPageIndex?: number = 0;
  pageSize?: number = 20;
  ecm_path?: string;
  quickFilters?: string;
  ecm_fulltext?: string;
  production_date?: string; // production_date: '["lastYear"]',
  ecm_primaryType?: string; // ecm_primaryType: '["App-Backslash-Video", "App-Backslash-Article"]'
}

export class NuxeoRequestOptions {
  schemas: string[] = ['*'];
  enrichers: {} = { document: ['thumbnail'] };
}

export class NuxeoPagination {
  readonly entityType: string;
  readonly entries: DocumentModel[];
  readonly currentPageSize: number;
  readonly currentPageIndex: number;
  readonly aggregations: any;
  readonly quickFilters: any[];
  readonly isLastPageAvailable: boolean;
  readonly isNextPageAvailable: boolean;
  readonly isPaginable: boolean;
  readonly isPreviousPageAvailable: boolean;
  readonly isSortable: boolean;
  readonly maxPageSize: number;
  readonly numberOfPages: number;
  readonly pageSize: number;
  readonly resultsCount: number;
  readonly errorMessage: string;
  readonly hasError: boolean;

  constructor(response: any = {}) {
    this.entityType = response['entity-type'];
    this.entries = response.entries || [];
    this.currentPageSize = response.currentPageSize || 0;
    this.currentPageIndex = response.currentPageIndex || 0;
    this.aggregations = response.aggregations || {};
    this.quickFilters = response.quickFilters || [];
    this.isLastPageAvailable = response.isLastPageAvailable || false;
    this.isNextPageAvailable = response.isNextPageAvailable || false;
    this.isPaginable = response.isPaginable || false;
    this.isPreviousPageAvailable = response.isPreviousPageAvailable || false;
    this.isSortable = response.isSortable || false;
    this.maxPageSize = response.maxPageSize || 0;
    this.numberOfPages = response.numberOfPages || 0;
    this.pageSize = response.pageSize || 0;
    this.resultsCount = response.resultsCount || 0;
    this.errorMessage = response.errorMessage;
    this.hasError = response.hasError || false;
  }

}
