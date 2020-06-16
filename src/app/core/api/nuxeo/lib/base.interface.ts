import { join } from '../../../services/helpers';
import { DocumentModel } from './nuxeo.document-model';

const API_PATH = 'api/v1/';

export abstract class AbstractCore {

  protected opts: any;
  protected baseUrl: string = '';
  protected apiPath: string;
  protected restUrl: string;
  protected assetPath: string;
  protected automationUrl: string;
  protected baseOptions: any = {};

  constructor(opts: NuxeoApiOptions) {
    this.apiPath = API_PATH;
    this.baseUrl = opts.baseUrl;
    this.assetPath = opts.assetPath;
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
  readonly placeholder: string;
  readonly iteration?: boolean = false;
  readonly optionLabels?: any = {};
  readonly bufferSize?: number = 50;
  readonly visibleFn: Function = (searchParams: NuxeoPageProviderParams): boolean => true;
  readonly filterValueFn: Function = (bucket: any): boolean => true;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}

export enum NuxeoPageProviderConstants {
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
  production: boolean;
  appName: string;
  assetPath: string;

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

export class NuxeoPageProviderParams {
  [key: string]: any;
  currentPageIndex?: number = 0;
  pageSize?: number = 20;
  ecm_path?: string;
  sortBy?: string;
  sortOrder?: string;
  ecm_mixinType_not_in?: string = NuxeoPageProviderConstants.HiddenInNavigation;
  highlight?: string = 'dc:title.fulltext,ecm:binarytext,dc:description.fulltext,ecm:tag,note:note.fulltext,file:content.name';
  quickFilters?: string = `${NuxeoQuickFilters.ProductionDate},${NuxeoQuickFilters.Alphabetically}`;
  keyword?: string;
  ecm_fulltext?: string;
  production_date?: string; // production_date: '["lastYear"]',
  ecm_primaryType?: string; // ecm_primaryType: '["App-Backslash-Video", "App-Backslash-Article"]'

  constructor(opts: any = {}) {
    Object.assign(this, opts);
  }

  hasKeyword(): boolean {
    return !!this.ecm_fulltext || !!this.keyword;
  }

  hasFilters(): boolean {
    return this.hasFilter('_agg');
  }

  hasFilter(agg: string): boolean {
    return Object.getOwnPropertyNames(this).some((key: string) => key.includes(agg));
  }

  get ecm_fulltext_wildcard(): string {
    return `${this.ecm_fulltext}*`;
  }

}

export class NuxeoRequestOptions {
  readonly [key: string]: any;
  readonly skipAggregates?: boolean = true;
  readonly schemas?: string[] = ['dublincore', 'file', 'files', 'video', 'picture', 'facetedTag', 'app_global', 'app_global_fields', 'app_Edges', 'The_Loupe_Main', 'The_Loupe_ProdCredits', 'The_Loupe_Rights'];
  readonly enrichers?: {} = {
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

  constructor(opts: any = {}) {
    Object.assign(this, opts);
  }

  addEnrichers(type: string, name: string): void {
    this.enrichers[type].push(name);
  }

  setEnrichers(type: string, names: string[]): void {
    this.enrichers[type] = names;
  }

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
    this.errorMessage = response.errorMessage || '';
    this.hasError = response.hasError || false;
  }

  buildAggregateModels(): AggregateModel[] {
    return Object.values(this.aggregations).map((agg: any) => new AggregateModel(agg));
  }

}

export class NuxeoBlob {

  readonly content: any;
  readonly name: string;
  readonly uploadFileType: string; // asset or attachment
  readonly mimeType: string;
  readonly size: number;
  readonly formMode: string;
  fileIdx: number;

  constructor(opts: any = {}) {
    this.uploadFileType = opts.uploadFileType;
    this.formMode = opts.formMode;
    this.content = opts.content;
    this.fileIdx = opts.fileIdx;
    this.name = opts.name || this.content.name;
    this.mimeType = opts.mimeType || opts['mime-type'] || this.content.type;
    this.size = opts.size || opts.length || this.content.size;
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
  readonly fileName: string;
  readonly fileSize: string;
  readonly mimeType: string;
  readonly blob: NuxeoBlob;
  readonly formMode: string;
  uploadFileType: string; // 'asset' | 'attachment';
  fileIdx: number;

  constructor(response: any = {}) {
    Object.assign(this, response);
    if (response.blob) {
      this.fileIdx = this.blob.fileIdx;
      this.fileName = this.blob.name;
      this.mimeType = this.blob.mimeType;
      this.uploadFileType = this.blob.uploadFileType;
      this.formMode = this.blob.formMode;
      this.fileSize = this.blob.size.toString();
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
  GetFavorite = 'Favorite.Fetch',
  AddFavorite = 'Document.AddToFavorites',
  RemoveFromFavorites = 'Document.RemoveFromFavorites',
  GetVideoScreenshot = 'Backslash.GetVideoScreenshot',
  TBWAUserDigest = 'TBWA.GetUserDigest',
  GetAccessTokenInfo = 'TBWA.GetAccessTokenInfo',
  MoveToTrash = 'Document.Trash',
  DownloadRequest = 'App-BizDev-Asset-Download-Request-email',
}
