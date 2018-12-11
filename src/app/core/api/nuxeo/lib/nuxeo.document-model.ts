import { Base } from './base.api';
import { join } from './nuxeo.helpers';
import { Observable } from 'rxjs';
import { NuxeoResponse } from './base.interface';
import { isThisTypeNode } from 'typescript';

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

export class DocumentModel extends Base {

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

  get uid(): string {
    return this._uid;
  }

  set uid(uid: string) {
    this._uid = uid;
  }

  get thumbnailUrl(): string {
    return this.contextParameters.thumbnail.url;
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

  fetchRenditions(opts: any = {}): Observable<NuxeoResponse> {
    const Promise = this._nuxeo.Promise;
    if (this.contextParameters && this.contextParameters.renditions) {
      return Promise.resolve(this.contextParameters.renditions);
    }

    const options = this._computeOptions(opts);
    options.enrichers = { document: ['renditions'] };
    return this._repository
      .fetch(this.uid, options)
      .subscribe((doc: any) => {
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
    return this._nuxeo.request(path).get(options);
  }
}
