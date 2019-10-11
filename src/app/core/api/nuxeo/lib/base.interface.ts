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
  filterValue: Function = (bucket: any): boolean => true;
  iteration: boolean = false;
  convertTitle: boolean = false;
  optionLabels: any = {};
  placeholder: string;
  label: string;

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
        bucket.label = list[bucket.key];
      }
    });
  }
}

export class SearchFilterModel {
  readonly key: string;
  readonly placeholder: string;
  readonly iteration?: boolean = false;
  readonly convertTitle?: boolean = false;
  readonly optionLabels?: any = {};
  readonly filterValue: Function = (bucket: any): boolean => true;
  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}

export function filterAggregates(filters: SearchFilterModel[] = [], models: AggregateModel[] = []): AggregateModel[] {
  const numberOfModels: number = models.length;
  const aggregates: AggregateModel[] = [];
  filters.forEach((filter: SearchFilterModel) => {
    if (numberOfModels === 0) {
      aggregates.push(new AggregateModel({ label: filter.placeholder, placeholder: filter.placeholder, convertTitle: filter.convertTitle, iteration: filter.iteration, optionLabels: filter.optionLabels }));
    } else {
      const agg: AggregateModel = models.filter((x: AggregateModel) => x.id === filter.key).shift();
      if (agg) {
        agg.label = filter.placeholder;
        agg.placeholder = filter.placeholder;
        agg.convertTitle = filter.convertTitle;
        agg.iteration = filter.iteration;
        agg.filterValue = filter.filterValue;
        agg.optionLabels = filter.optionLabels;
        aggregates.push(agg);
      }
    }
  });
  return aggregates;
}

export enum NuxeoQuickFilters {
  Alphabetically = 'Alphabetically',
  ProductionDate = 'ProductionDate',
  // ShowInNavigation = 'ShowInNavigation',
  // HiddenInNavigation = 'HiddenInNavigation',
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
  ecm_mixinType_not_in?: string = '["HiddenInNavigation"]';
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
}

export class NuxeoRequestOptions {
  readonly [key: string]: any;
  readonly skipAggregates?: boolean = true;
  readonly schemas?: string[] = ['dublincore', 'file', 'files', 'video', 'picture', 'app_global', 'app_Edges', 'The_Loupe_Main', 'The_Loupe_ProdCredits'];
  readonly enrichers?: {} = {
    document: [
      NuxeoEnricher.document.PREVIEW,
      // NuxeoEnricher.document.SUBTYPES,
      NuxeoEnricher.document.HIGHLIGHT,
      NuxeoEnricher.document.THUMBNAIL,
      NuxeoEnricher.document.FAVORITES,
      // NuxeoEnricher.document.BREADCRUMB,
      NuxeoEnricher.document.PERMISSIONS,
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
  CreativeGetDocumentURStatus = 'Creative.GetDocumentAllURStatus',
  DirectorySuggestEntries = 'Directory.SuggestEntries',
  RepositoryPageProvider = 'Repository.PageProvider',
  DirectoryEntries = 'Directory.Entries',
  DocumentCreate = 'Document.Create',
  GetFavorite = 'Favorite.Fetch',
  AddFavorite = 'Document.AddToFavorites',
  RemoveFromFavorites = 'Document.RemoveFromFavorites',
  TBWAUserDigest = 'TBWA.GetUserDigest',
  GetAccessTokenInfo = 'TBWA.GetAccessTokenInfo',
  MoveToTrash = 'Document.Trash',
}

export enum NuxeoUserGroups {
  Everyone = 'Everyone-o-tbwa-AUTOPOP',
}
