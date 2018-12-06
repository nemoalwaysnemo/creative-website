import { Base } from './base.api';
import { join } from './nuxeo.helpers';
import { Observable } from 'rxjs';
import { NuxeoResponse } from './base.interface';

const enricher = {
  document: {
    ACLS: 'acls',
    BREADCRUMB: 'breadcrumb',
    CHILDREN: 'children',
    DOCUMENT_URL: 'documentURL',
    PERMISSIONS: 'permissions',
    PREVIEW: 'preview',
  },
};

export class Document extends Base {

  private _repository: any;
  private _properties: any;
  private _dirtyProperties: any;
  private _facets: string;
  private _uid: any;
  private _contextParameters: any;

  constructor(doc: any = {}, opts: any = {}) {
    super(opts);
    this._nuxeo = opts.nuxeo;
    this._repository = opts.repository || this._nuxeo.repository(doc.repository, opts);
    this._properties = {};
    this._dirtyProperties = {};
    Object.assign(this, doc);
  }

  get properties(): any {
    return this._properties;
  }

  set properties(properties: any) {
    this._properties = properties;
  }

  get facets(): any {
    return this._facets;
  }

  set facets(facets: any) {
    this._facets = facets;
  }

  get uid(): any {
    return this._uid;
  }

  set uid(uid: any) {
    this._uid = uid;
  }

  get contextParameters(): any {
    return this._contextParameters;
  }

  set contextParameters(contextParameters: any) {
    this._contextParameters = contextParameters;
  }

  get(propertyName: string): any {
    return this._dirtyProperties[propertyName] || this.properties[propertyName];
  }

  hasFacet(facet: string): boolean {
    return this.facets.indexOf(facet) !== -1;
  }

  isFolder(): boolean {
    return this.hasFacet('Folderish');
  }

  isCollection(): boolean {
    return this.hasFacet('Collection');
  }

  isCollectable(): boolean {
    return !this.hasFacet('NotCollectionMember');
  }

  fetchBlob(xpath: string = 'blobholder:0', opts: any = {}): Observable<NuxeoResponse> {
    let options = opts;
    let blobXPath = xpath;
    if (typeof xpath === 'object') {
      options = xpath;
      blobXPath = 'blobholder:0';
    }
    options = this._computeOptions(options);
    const path = join('id', this.uid, '@blob', blobXPath);
    return this._nuxeo.request(path).get(options);
  }

  fetchWorkflows(opts: any = {}): Observable<NuxeoResponse> {
    const options = this._computeOptions(opts);
    const path = join('id', this.uid, '@workflow');
    options.documentId = this.uid;
    return this._nuxeo.request(path)
      .get(options);
  }

  fetchRenditions(opts: any = {}): Observable<NuxeoResponse> {
    const Promise = this._nuxeo.Promise;
    if (this.contextParameters && this.contextParameters.renditions) {
      return Promise.resolve(this.contextParameters.renditions);
    }

    const options = this._computeOptions(opts);
    options.enrichers = { document: ['renditions'] };
    return this._repository
      .fetch(this.uid, options)
      .then((doc: any) => {
        if (!this.contextParameters) {
          this.contextParameters = {};
        }
        this.contextParameters.renditions = doc.contextParameters.renditions;
        return this.contextParameters.renditions;
      });
  }

  fetchRendition(name: string, opts: any = {}): Observable<NuxeoResponse> {
    const options = this._computeOptions(opts);
    const path = join('id', this.uid, '@rendition', name);
    return this._nuxeo.request(path)
      .get(options);
  }

  fetchACLs(opts: any = {}): Observable<NuxeoResponse> {
    const Promise = this._nuxeo.Promise;
    if (this.contextParameters && this.contextParameters.acls) {
      return Promise.resolve(this.contextParameters.acls);
    }

    const options = this._computeOptions(opts);
    options.enrichers = { document: [enricher.document.ACLS] };
    return this._repository
      .fetch(this.uid, options)
      .then((doc: any) => {
        if (!this.contextParameters) {
          this.contextParameters = {};
        }
        this.contextParameters.acls = doc.contextParameters.acls;
        return this.contextParameters.acls;
      });
  }

  hasPermission(name: string, opts: any = {}): Observable<NuxeoResponse> {
    const Promise = this._nuxeo.Promise;
    if (this.contextParameters && this.contextParameters.permissions) {
      return Promise.resolve(this.contextParameters.permissions.indexOf(name) !== -1);
    }

    const options = this._computeOptions(opts);
    options.enrichers = { document: [enricher.document.PERMISSIONS] };
    return this._repository
      .fetch(this.uid, options)
      .then((doc: any) => {
        if (!this.contextParameters) {
          this.contextParameters = {};
        }
        this.contextParameters.permissions = doc.contextParameters.permissions;
        return this.contextParameters.permissions.indexOf(name) !== -1;
      });
  }

  fetchLockStatus(opts: any = {}): Observable<NuxeoResponse> {
    const options = this._computeOptions(opts);
    options.fetchProperties = { document: ['lock'] };
    return this._repository
      .fetch(this.uid, options)
      .then((doc: any) => {
        return {
          lockOwner: doc.lockOwner,
          lockCreated: doc.lockCreated,
        };
      });
  }

  fetchAudit(queryOpts: any = {}, opts: any = {}): Observable<NuxeoResponse> {
    const options = this._computeOptions(opts);
    const path = join('id', this.uid, '@audit');
    return this._nuxeo.request(path)
      .queryParams(queryOpts)
      .get(options);
  }
}
