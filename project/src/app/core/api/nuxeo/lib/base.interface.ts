import { join, isValueEmpty, objHasKey } from '../../../services/helpers';
import { DocumentModel } from './nuxeo.document-model';

const API_PATH = 'api/v1/';

export abstract class AbstractCore {

  protected opts: any;
  protected baseUrl: string = '';
  protected apiPath: string;
  protected restUrl: string;
  protected automationUrl: string;
  protected baseOptions: any = {};

  constructor(opts: NuxeoApiOptions) {
    this.apiPath = API_PATH;
    this.baseUrl = opts.baseUrl;
    this.restUrl = join(this.baseUrl, this.apiPath);
    this.automationUrl = join(this.restUrl, 'automation/');
  }
}

export class Credentials {
  clientId?: string;
  secret?: string;
  token?: any;
  username?: string;
  password?: string;
  method?: string;
  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}

export class AuthenticationToken {
  access_token: any;
}

export class AggregateModel {
  readonly id: string;
  readonly entityType: string;
  readonly buckets: {}[] = [];
  readonly extendedBuckets: {}[] = [];
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

export class SearchFilterModel {
  readonly key: string;
  readonly options?: any[];
  readonly placeholder: string;
  readonly iteration?: boolean = false;
  readonly optionLabels?: any = {};
  readonly bufferSize?: number = 50;
  readonly visibleFn: (searchParams: GlobalSearchParams) => boolean = () => true;
  readonly filterValueFn: (bucket: any) => boolean = () => true;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}

export enum NuxeoSearchConstants {
  HiddenInNavigation = '["HiddenInNavigation"]',
  Collection = 'Collection',
  Favorites = 'Favorites',
}

export enum NuxeoQuickFilters {
  Alphabetically = 'Alphabetically',
  ProductionDate = 'ProductionDate',
  BackslashEdgePage = 'BackslashEdgePage',
}

export enum NuxeoSortByFields {
  Title = 'dc:title',
  ProductionDate = 'The_Loupe_ProdCredits:production_date',
}

export const NuxeoEnricher = {
  user: {
    PROFILE: 'userprofile',
  },
  document: {
    ACLS: 'acls',
    TAGS: 'tags',
    SUBTYPES: 'subtypes',
    PREVIEW: 'preview',
    CHILDREN: 'children',
    HIGHLIGHT: 'highlight',
    THUMBNAIL: 'thumbnail',
    FAVORITES: 'favorites',
    BREADCRUMB: 'breadcrumb',
    PERMISSIONS: 'permissions',
    DOCUMENT_URL: 'documentURL',
    HAS_CONTENT: 'hasContent', // Boolean flag indicating whether or not current Folderish or Collection document has children or members
    HAS_FOLDERISH_CHILD: 'hasFolderishChild', // Boolean flag indicating whether or not current document has folderish child document
    USER_VISIBLE_PERMISSIONS: 'userVisiblePermissions', // List of permissions available on current document
    FIRST_ACCESSIBLE_ANCESTOR: 'firstAccessibleAncestor', // The closest document's ancestor which is used to find what safe document to redirect to when deleting some.
  },
};

export enum NuxeoPermission {
  Write = 'Write',
  Read = 'Read',
  ReadWrite = 'ReadWrite',
  Everything = 'Everything',
  AddChildren = 'AddChildren',
  Delete = 'Remove',
}

export class NuxeoApiOptions {
  baseUrl: string = '';
  auth?: Credentials;
  appName: string;

  constructor(opts: any = {}) {
    Object.assign(this, opts);
  }
}

export class NuxeoResponse {
  [key: string]: any;
  constructor(opts: any = {}) {
    Object.assign(this, opts);
  }
}

export class NuxeoQueryParams {
  [key: string]: any;
  currentPageIndex: number;
  constructor(params: any = {}) {
    if (!isValueEmpty(params)) {
      this.merge(params);
    }
  }

  merge(params: any = {}): this {
    Object.assign(this, params);
    return this;
  }

  hasKeyword(): boolean {
    return !!this.ecm_fulltext || !!this.q;
  }

  hasFilters(): boolean {
    return this.hasParam('_agg') || this.hasParam('__in') || this.hasParam('__eq');
  }

  hasParam(name: string): boolean {
    return Object.getOwnPropertyNames(this).some((key: string) => key.includes(name));
  }

  // convert query params to form values
  toSearchParams(): any {
    const params: any = {};
    const queryParams = this;
    const keys = Object.keys(this);
    if (keys.length > 0) {
      if (queryParams['q']) {
        params['ecm_fulltext'] = queryParams['q'];
      }
      if (queryParams['currentPageIndex'] && typeof queryParams['currentPageIndex'] === 'number') {
        params['currentPageIndex'] = queryParams['currentPageIndex'];
      }
      params['aggregates'] = {};
      for (const key of keys) {
        if (key.includes('_agg')) {
          params['aggregates'][key] = typeof queryParams[key] === 'string' ? [queryParams[key]] : queryParams[key];
        } else if (key.includes('__in')) {
          try {
            params['aggregates'][key] = [];
            if (Array.isArray(queryParams[key])) {
              queryParams[key].forEach((v: any, i: number) => params['aggregates'][key][i] = `["${v.replace(/ /g, '').split(',').join('", "')}"]`);
            } else {
              params['aggregates'][key][0] = `["${queryParams[key].replace(/ /g, '').split(',').join('", "')}"]`;
            }
          } catch (error) {
            console.warn('filter parse error', error);
          }
        } else if (key.includes('__eq')) {
          params['aggregates'][key] = queryParams[key];
        } else {
          params[key] = queryParams[key];
        }
      }
      delete params['q'];
    }
    return params;
  }
}

export class NuxeoSearchParams {
  [key: string]: any;
  condition: string = '';
  currentPageIndex: number = 0;
  pageSize: number = 24;
  ecm_path?: string;
  ecm_fulltext: string = '';
  ecm_primaryType: string; // ecm_primaryType: '["App-Backslash-Video", "App-Backslash-Article"]'
  ecm_mixinType?: string;
  ecm_mixinType_not_in?: string = NuxeoSearchConstants.HiddenInNavigation;
  highlight?: string = 'dc:title.fulltext,ecm:binarytext,dc:description.fulltext,ecm:tag,note:note.fulltext,file:content.name';
  quickFilters?: string = `${NuxeoQuickFilters.ProductionDate},${NuxeoQuickFilters.Alphabetically}`;
  sortOrder?: string;
  keyword?: string;
  sortBy?: string;

  constructor(params: any = {}) {
    if (!isValueEmpty(params)) {
      this.merge(params);
    }
  }

  get ecm_fulltext_wildcard(): string {
    return `${this.ecm_fulltext}*`;
  }

  merge(params: any = {}): this {
    Object.assign(this, params);
    return this;
  }

  hasKeyword(): boolean {
    return !!this.ecm_fulltext || !!this.keyword;
  }

  hasFilters(): boolean {
    return !isValueEmpty(this.aggregates);
  }

  hasParam(name: string): boolean {
    return Object.getOwnPropertyNames(this).some((key: string) => key.includes(name));
  }
}

export class GlobalSearchParams {

  static readonly PageSize: number = 24;

  static readonly LoadMoreSize: number = 6;

  private settings: any = {};

  private searchParams: NuxeoSearchParams;

  private queryParams: NuxeoQueryParams = new NuxeoQueryParams();

  constructor(params: any = {}, settings: any = {}) {
    this.setParams(params);
    this.setSettings(settings);
    // console.log((new Error()).stack);
  }

  get event(): string {
    return this.settings['event'];
  }

  get source(): string {
    return this.settings['source'];
  }

  get providerParams(): NuxeoSearchParams {
    return this.searchParams;
  }

  hasKeyword(): boolean {
    return this.providerParams.hasKeyword() || this.queryParams.hasKeyword();
  }

  hasFilters(): boolean {
    return this.providerParams.hasFilters() || this.queryParams.hasFilters();
  }

  hasParam(key: string): boolean {
    return this.providerParams.hasParam(key) || this.hasAggregates(key) || this.hasQueryParam(key);
  }

  hasQueryParam(key: string): boolean {
    return this.queryParams.hasParam(key);
  }

  hasAggregates(key: string): boolean {
    return objHasKey(this.searchParams['aggregates'], key) && this.searchParams['aggregates'][key].length > 0;
  }

  setParams(params: any): this {
    if (this.searchParams && this.searchParams['aggregates'] && !params['aggregates']) {
      params['aggregates'] = this.searchParams['aggregates'];
    }
    this.searchParams = new NuxeoSearchParams(params);
    return this;
  }

  setQueryParams(params: any): this {
    this.queryParams = new NuxeoQueryParams(params);
    return this;
  }

  mergeParams(params: any): this {
    this.searchParams.merge(params);
    return this;
  }

  hasSettings(): boolean {
    return !isValueEmpty(this.settings);
  }

  setSettings(settings: any = {}): this {
    if (!isValueEmpty(settings)) {
      this.settings = settings;
    }
    return this;
  }

  mergeSettings(settings: any = {}): this {
    if (!isValueEmpty(settings)) {
      this.settings = Object.assign({}, this.settings, settings);
    }
    return this;
  }

  getSettings(key?: string): any {
    return key ? this.settings[key] : this.settings;
  }

  getFulltextKey(): string {
    return this.getSettings('fulltextKey') || 'ecm_fulltext';
  }

  hasNoFulltextSearch(): boolean {
    return !this.searchParams['ecm_fulltext'];
  }

  toFormValues(): any {
    return Object.assign({}, this.searchParams, this.queryParams.toSearchParams());
  }
  // used for nuxeoApi.pageProvider request
  toRequestParams(): any {
    let params: any = {};
    const keys: string[] = ['keyword', 'aggregates', 'showFilter'];
    const mergedParams = Object.assign({}, this.searchParams, this.queryParams.toSearchParams());
    const providerParams = Object.entries(mergedParams);
    for (const [key, value] of providerParams) {
      if (!keys.includes(key)) {
        params[key] = value;
      }
    }
    if (!isValueEmpty(mergedParams['aggregates'])) {
      params = this.buildAggSearchParams(mergedParams['aggregates'], params);
    }
    if (params['ecm_fulltext'] && this.getFulltextKey() !== 'ecm_fulltext') {
      params[this.getFulltextKey()] = params['ecm_fulltext'];
      delete params['ecm_fulltext'];
    } else if (!params['ecm_fulltext']) {
      delete params[this.getFulltextKey()];
    }
    if (params['ecm_mixinType'] || !params['ecm_mixinType_not_in']) {
      delete params['ecm_mixinType_not_in'];
    }
    if (!params['ecm_path'] && !params['ecm_path_eq']) {
      params.ecm_path = '/';
    } else if (params['ecm_path_eq']) {
      params.ecm_path_eq = '/' + params.ecm_path_eq.split('/').filter((x: string) => x.trim()).join('/');
      delete params['ecm_path'];
    }
    return params;
  }

  // used for url query string
  toQueryParams(): any {
    const params: any = {};
    const aggregates = this.searchParams.aggregates;
    if (!isValueEmpty(aggregates)) {
      const keys = Object.keys(aggregates).filter((key) => aggregates[key].length > 0);
      for (const key of keys) {
        if (key.includes('_agg')) {
          params[key] = aggregates[key];
        } else if (key.includes('__in')) {
          try {
            if (Array.isArray(aggregates[key])) {
              params[key] = [];
              aggregates[key].forEach((v: any, i: number) => params[key][i] = JSON.parse(v).join(','));
            }
          } catch (error) {
            console.warn('filter parse error', error);
          }
        } else if (key.includes('__eq')) {
          params[key] = aggregates[key];
        }
      }
    }
    if (this.searchParams.ecm_fulltext) {
      params['q'] = this.searchParams.ecm_fulltext;
    }
    // if (this.searchParams.currentPageIndex > 0) {
    //   params['currentPageIndex'] = this.searchParams.currentPageIndex;
    // }
    if (!isValueEmpty(this.settings)) {
      const keys: string[] = ['showFilter'];
      const settings = Object.entries(this.settings);
      for (const [key, value] of settings) {
        if (keys.includes(key)) {
          params[key] = value;
        }
      }
    }
    return params;
  }

  private buildAggSearchParams(aggregates: any = {}, params: any = {}): any {
    if (!isValueEmpty(aggregates)) {
      const keys = Object.keys(aggregates).filter((key) => aggregates[key].length > 0);
      for (const key of keys) {
        if (key.includes('__in')) {
          if (Array.isArray(aggregates[key])) {
            let p = [];
            const k = key.replace('__in', '');
            aggregates[key].forEach((v: any) => p = p.concat(JSON.parse(v)));
            params[k] = `["${p.join('", "')}"]`;
          }
        } else if (key.includes('__eq')) {
          const k = key.replace('__eq', '');
          params[k] = aggregates[key];
        } else {
          params[key] = `["${aggregates[key].join('", "')}"]`;
        }
      }
    }
    return params;
  }

}

export class NuxeoRequestOptions {
  [key: string]: any;
  skipAggregates?: boolean = true;
  schemas?: string[] = ['dublincore', 'file', 'files', 'video', 'picture', 'facetedTag', 'app_global', 'app_global_fields', 'app_Edges', 'app_Learning', 'The_Loupe_Main', 'The_Loupe_ProdCredits', 'The_Loupe_Rights', 'collectionMember'];
  enrichers?: {} = {
    document: [
      NuxeoEnricher.document.PREVIEW,
      // NuxeoEnricher.document.SUBTYPES,
      NuxeoEnricher.document.HIGHLIGHT,
      NuxeoEnricher.document.THUMBNAIL,
      NuxeoEnricher.document.FAVORITES,
      NuxeoEnricher.document.BREADCRUMB,
      NuxeoEnricher.document.PERMISSIONS,
      NuxeoEnricher.document.HAS_CONTENT,
      NuxeoEnricher.document.HAS_FOLDERISH_CHILD,
    ],
  };

  constructor(params: any = {}) {
    if (!isValueEmpty(params)) {
      Object.assign(this, params);
    }
  }

  setOptions(key: string, value: any): this {
    if (typeof value !== 'undefined' && value !== null) {
      this[key] = value;
    }
    return this;
  }

  addEnrichers(type: string, name: string): void {
    this.enrichers[type].push(name);
  }

  setEnrichers(type: string, names: string[]): void {
    this.enrichers[type] = names;
  }

  addSchemas(name: string): void {
    this.schemas.push(name);
  }
}

export class NuxeoPagination {
  aggregations: any;
  readonly entityType: string;
  readonly entries: DocumentModel[];
  readonly currentPageSize: number;
  readonly currentPageIndex: number;
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
    this.errorMessage = response.errorMessage || '';
    this.hasError = response.hasError || false;
  }

  buildAggregateModels(): AggregateModel[] {
    return Object.values(this.aggregations).map((agg: any) => new AggregateModel(agg));
  }

  hasAgg(): boolean {
    return !isValueEmpty(this.aggregations);
  }

  hasResult(): boolean {
    return !isValueEmpty(this.entries);
  }
}

export class NuxeoBlob {
  readonly content: any;
  readonly name: string;
  readonly xpath: string; // asset or attachment
  readonly label: string;
  readonly mimeType: string;
  readonly size: number;
  readonly formMode: string;
  readonly original: boolean;
  readonly isFileList: boolean = false;
  fileIdx: number;

  constructor(opts: any = {}) {
    this.xpath = opts.xpath;
    this.label = opts.label;
    this.isFileList = opts.isFileList;
    this.formMode = opts.formMode;
    this.content = opts.content;
    this.fileIdx = opts.fileIdx;
    this.original = opts.original;
    this.name = opts.name || this.content.name;
    this.mimeType = opts.mimeType || opts['mime-type'] || this.content.type;
    this.size = opts.size || opts.length || this.content.size || this.content.length;
  }
}

export class BatchBlob {

  constructor(opts: any = {}) {
    this['upload-batch'] = opts.batchId;
    this['upload-fileId'] = `${opts.fileIdx}`;
    delete opts.batchId;
    delete opts.fileIdx;
    Object.assign(this, opts);
  }
}

export class NuxeoUploadResponse {
  [key: string]: any;
  readonly uploaded: boolean = false;
  readonly dropped: boolean = false;
  readonly uploadedSize: number;
  readonly uploadType: string;
  readonly batchId: string;
  readonly kbLoaded: number = 0;
  readonly percentLoaded: number = 0;
  readonly batchBlob: BatchBlob;
  readonly blob: NuxeoBlob;
  readonly isFileList: boolean;
  readonly fileName: string;
  readonly fileSize: string;
  readonly mimeType: string;
  readonly formMode: string;
  readonly original: boolean;
  readonly xpath: string;
  readonly label: string;
  fileIdx: number;

  constructor(response: any = {}) {
    Object.assign(this, response);
    if (response.blob) {
      this.fileIdx = response.blob.fileIdx;
      this.fileName = response.blob.name;
      this.mimeType = response.blob.mimeType;
      this.xpath = response.blob.xpath;
      this.label = response.blob.label;
      this.original = response.blob.original;
      this.isFileList = response.blob.isFileList;
      this.formMode = response.blob.formMode;
      this.fileSize = response.blob.size.toString();
    }
  }

  isMainFile(): boolean {
    return this.xpath === 'file:content';
  }

  isAttachment(): boolean {
    return this.xpath === 'files:files';
  }

  isOtherType(): boolean {
    return !this.isMainFile() && !this.isAttachment();
  }

  getFileType(): string {
    if (this.isMainFile()) {
      return 'Main File';
    } else if (this.isAttachment()) {
      return 'Attachment';
    } else {
      return this.label;
    }
  }
}

export enum NuxeoAutomations {
  GetDocumentURStatus = 'Creative.GetDocumentAllURStatus',
  DirectorySuggestEntries = 'Directory.SuggestEntries',
  UserGroupSuggestion = 'UserGroup.Suggestion',
  TagSuggestion = 'Tag.Suggestion',
  GetCurrentUser = 'User.Get',
  RepositoryPageProvider = 'Repository.PageProvider',
  ContentViewPageProvider = 'ContentView.PageProvider',
  InitializeDocument = 'Document.Initialize',
  DirectoryEntries = 'Directory.Entries',
  GetDocument = 'Creative.GetDocument',
  DocumentCreate = 'Document.Create',
  GetFavoriteDocument = 'Favorite.Fetch',
  AddToFavorites = 'Document.AddToFavorites',
  AddToCollection = 'Document.AddToCollection',
  GetDocumentsFromCollection = 'Collection.GetDocumentsFromCollection',
  RemoveFromFavorites = 'Document.RemoveFromFavorites',
  GetVideoScreenshot = 'Backslash.GetVideoScreenshot',
  TBWARemoteSearch = 'TBWA.RemoteSearch',
  TBWAUserDigest = 'TBWA.GetUserDigest',
  GetAccessTokenInfo = 'TBWA.GetAccessTokenInfo',
  GetWebPageElement = 'TBWA.GetWebPageElement',
  MoveToTrash = 'Document.Trash',
  DownloadRequest = 'App-BizDev-Asset-Download-Request-email',
  SendDeliveryPackage = 'App-Library-Delivery-Package-Send',
  GetSimpleUserPreferences = 'TBWA.GetSimpleUserPreferences',
  SetSimpleUserPreferences = 'TBWA.SetSimpleUserPreferences',
}
