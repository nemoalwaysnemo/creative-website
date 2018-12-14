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

export class NuxeoOptions {
  baseUrl: string = '';
  auth?: Credentials;
  production: boolean;
  appName: string;
}

export class NuxeoResponse {
  data: any;
}

export class NuxeoRequestParams {
  [key: string]: any;
  currentPageIndex?: number = 1;
  pageSize?: number = 20;
  ecm_fulltext?: string;
  ecm_primaryType?: string; // ecm_primaryType: '["App-Backslash-Video", "App-Backslash-Article"]'
}

export class NuxeoRequestOptions {
  schemas: string[] = ['*'];
  enrichers: {} = { document: ['thumbnail'] };
}

export class NuxeoPagination {

  private _entityType: string;
  private _entries: DocumentModel[];
  private _currentPageSize: number;
  private _currentPageIndex: number;
  private _aggregations: any;
  private _quickFilters: any[];
  private _isLastPageAvailable: boolean;
  private _isNextPageAvailable: boolean;
  private _isPaginable: boolean;
  private _isPreviousPageAvailable: boolean;
  private _isSortable: boolean;
  private _maxPageSize: number;
  private _numberOfPages: number;
  private _pageSize: number;
  private _resultsCount: number;
  private _errorMessage: string;
  private _hasError: boolean;

  constructor(response: any = {}) {
    this._entityType = response['entity-type'];
    this._entries = response.entries || [];
    this._currentPageSize = response.currentPageSize || 0;
    this._currentPageIndex = response.currentPageIndex || 0;
    this._aggregations = response.aggregations || {};
    this._quickFilters = response.quickFilters || [];
    this._isLastPageAvailable = response.isLastPageAvailable || false;
    this._isNextPageAvailable = response.isNextPageAvailable || false;
    this._isPaginable = response.isPaginable || false;
    this._isPreviousPageAvailable = response.isPreviousPageAvailable || false;
    this._isSortable = response.isSortable || false;
    this._maxPageSize = response.maxPageSize || 0;
    this._numberOfPages = response.numberOfPages || 0;
    this._pageSize = response.pageSize || 0;
    this._resultsCount = response.resultsCount || 0;
    this._errorMessage = response.errorMessage;
    this._hasError = response.hasError || false;
  }

  get entityType(): string {
    return this._entityType;
  }

  get entries(): DocumentModel[] {
    return this._entries;
  }

  get resultsCount(): number {
    return this._resultsCount;
  }

  get pageSize(): number {
    return this._pageSize;
  }

  get currentPageSize(): number {
    return this._currentPageSize;
  }

  get currentPageIndex(): number {
    return this._currentPageIndex;
  }

  get numberOfPages(): number {
    return this._numberOfPages;
  }

  get maxPageSize(): number {
    return this._maxPageSize;
  }

  get aggregations(): {} {
    return this._aggregations;
  }

  get quickFilters(): any[] {
    return this._quickFilters;
  }

  get isLastPageAvailable(): boolean {
    return this._isLastPageAvailable;
  }

  get isNextPageAvailable(): boolean {
    return this._isNextPageAvailable;
  }

  get isPaginable(): boolean {
    return this._isPaginable;
  }

  get isPreviousPageAvailable(): boolean {
    return this._isPreviousPageAvailable;
  }

  get isSortable(): boolean {
    return this._isSortable;
  }

  get errorMessage(): string {
    return this._errorMessage;
  }

  get hasError(): boolean {
    return this._hasError;
  }
}
