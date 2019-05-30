import { join, deepExtend, isDocumentUID } from '../../../services';
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
  readonly IDKeys: string[] = [];
  label: string;
  placeholder: string;

  constructor(data: any = {}) {
    this.entityType = data['entity-type'];
    Object.assign(this, data);
    this.buckets.forEach((value: { docCount: number, key: string }) => {
      if (isDocumentUID(value.key)) {
        this.IDKeys.push(value.key);
      }
    });
  }

  replaceIDWithName(list: { id: string, name: string }): void {
    if (this.IDKeys.length > 0) {
      this.replaceBuckets(this.buckets, list);
      this.replaceBuckets(this.extendedBuckets, list);
    }
  }

  private replaceBuckets(buckets: any[], list: { id: string, name: string }): void {
    buckets.forEach((bucket: any) => {
      if (isDocumentUID(bucket.key) && list[bucket.key]) {
        bucket.key = list[bucket.key];
      }
    });
  }
}

export function filterAggregates(mapping: { [key: string]: { label?: string, placeholder?: string } }, models: AggregateModel[] = []): AggregateModel[] {
  const numberOfModels: number = models.length;
  const aggregates: AggregateModel[] = [];
  const keys = Object.keys(mapping);
  for (const key of keys) {
    if (numberOfModels === 0) {
      aggregates.push(new AggregateModel({ label: mapping[key].label, placeholder: mapping[key].placeholder }));
    } else {
      const model = models.filter((x) => x.id === key).shift();
      if (model) {
        model.label = mapping[model.id].label;
        model.placeholder = mapping[model.id].placeholder;
        aggregates.push(model);
      }
    }
  }
  return aggregates;
}

export enum NuxeoQuickFilters {
  Alphabetically = 'Alphabetically',
  ProductionDate = 'ProductionDate',
  ShowInNavigation = 'ShowInNavigation',
  HiddenInNavigation = 'HiddenInNavigation',
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
    THUMBNAIL: 'thumbnail',
    FAVORITES: 'favorites',
    BREADCRUMB: 'breadcrumb',
    DOCUMENT_URL: 'documentURL',
    PERMISSIONS: 'permissions',
    USER_VISIBLE_PERMISSIONS: 'userVisiblePermissions',
  },
};

export enum NuxeoPermission {
  Write = 'Write',
  Read = 'Read',
  Everything = 'Everything',
  AddChildren = 'AddChildren',
}

export class NuxeoApiOptions {
  baseUrl: string = '';
  auth?: Credentials;
  production: boolean;
  appName: string;
  assetPath: string;
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
  quickFilters?: string = `${NuxeoQuickFilters.HiddenInNavigation},${NuxeoQuickFilters.ProductionDate},${NuxeoQuickFilters.Alphabetically}`;
  ecm_fulltext?: string;
  production_date?: string; // production_date: '["lastYear"]',
  ecm_primaryType?: string; // ecm_primaryType: '["App-Backslash-Video", "App-Backslash-Article"]'
}

export class NuxeoRequestOptions {
  readonly [key: string]: any;
  readonly skipAggregates?: boolean = true;
  readonly schemas?: string[] = ['dublincore', 'file', 'files', 'video', 'picture', 'app_global', 'app_Edges', 'The_Loupe_Main', 'The_Loupe_ProdCredits'];
  readonly enrichers?: {} = {
    document: [
      NuxeoEnricher.document.PREVIEW,
      NuxeoEnricher.document.SUBTYPES,
      NuxeoEnricher.document.THUMBNAIL,
      NuxeoEnricher.document.FAVORITES,
      // NuxeoEnricher.document.BREADCRUMB,
      NuxeoEnricher.document.PERMISSIONS,
    ],
  };
  constructor(opts: any = {}) {
    deepExtend(this, opts);
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
}

export class NuxeoBlob {

  readonly content: any;
  readonly name: string;
  readonly mimeType: string;
  readonly size: number;

  constructor(opts: any = {}) {
    this.content = opts.content;
    this.name = opts.name || this.content.name;
    this.mimeType = opts.mimeType || this.content.type;
    this.size = opts.size || this.content.size;
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

  readonly uploaded: boolean = false;
  readonly dropped: boolean = false;
  readonly fileIdx: number;
  readonly uploadedSize: number;
  readonly uploadType: string;
  readonly batchId: string;
  readonly kbLoaded: number = 0;
  readonly percentLoaded: number = 0;
  readonly batchBlob: BatchBlob;
  readonly fileName: string;
  readonly fileSize: string;
  readonly mimeType: string;
  title: string = null;

  constructor(response: any = {}) {
    Object.assign(this, response);
  }
}

export enum NuxeoAutomations {
  CreativeGetDocumentURStatus = 'Creative.GetDocumentURStatus',
  DirectorySuggestEntries = 'Directory.SuggestEntries',
  RepositoryPageProvider = 'Repository.PageProvider',
  DirectoryEntries = 'Directory.Entries',
  DocumentCreate = 'Document.Create',
  GetFavorite = 'Favorite.Fetch',
  AddFavorite = 'Document.AddToFavorites',
  RemoveFromFavorites = 'Document.RemoveFromFavorites',
  TBWAUserDigest = 'TBWA.GetUserDigest',
}
