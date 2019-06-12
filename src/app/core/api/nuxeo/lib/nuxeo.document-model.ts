import { Base } from './base.api';
import { join, deepExtend } from '../../../services';
import { NuxeoEnricher, BatchBlob } from './base.interface';
import { of as observableOf, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class DocumentModel extends Base {

  private _properties: any = {};
  private _dirtyProperties: any = {};
  private _contextParameters: any;
  private _facets: string;
  private _repository: any;

  uid: string;
  type: string;
  title: string;
  name: string;
  path: string;
  parentRef: string;

  constructor(doc: any = {}, opts: any = {}) {
    super(opts);
    if (opts.nuxeo) {
      this._nuxeo = opts.nuxeo;
      this._repository = opts.repository || this._nuxeo.repository(doc.repository, opts);
    }
    Object.assign(this, doc);
  }

  set(properties: any = {}): DocumentModel {
    this._dirtyProperties = deepExtend(this._dirtyProperties, properties);
    return this;
  }

  save(opts: any = {}): Observable<DocumentModel> {
    const options = this._computeOptions(opts);
    return this._repository.update({
      'entity-type': 'document',
      uid: this.uid,
      properties: this._dirtyProperties,
    }, options);
  }

  delete(opts: any = {}): Observable<DocumentModel> {
    const options = this._computeOptions(opts);
    return this._repository.delete(this.path);
  }

  attachBatchBlob(batchBlob: BatchBlob): this {
    this.properties['file:content'] = batchBlob;
    return this;
  }

  fetchBlob(xpath: string = 'blobholder:0', opts: any = {}): Observable<any> {
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

  fetchACLs(opts: any = {}): Observable<any> {
    if (this.contextParameters && this.contextParameters.acls) {
      return observableOf(this.contextParameters);
    }
    const options = this._computeOptions(opts);
    options.enrichers = { document: [NuxeoEnricher.document.ACLS] };
    return this._repository.fetch(this.uid, options).pipe(
      map((doc: DocumentModel) => {
        if (!this.contextParameters) {
          this.contextParameters = {};
        }
        this.contextParameters.acls = doc.contextParameters.acls;
        return this.contextParameters.acls;
      }));
  }

  hasPermission(name: string, opts: any = {}): Observable<boolean> {
    if (this.contextParameters && this.contextParameters.permissions) {
      return observableOf(this.contextParameters.permissions.indexOf(name) !== -1);
    }
    const options = this._computeOptions(opts);
    options.enrichers = { document: [NuxeoEnricher.document.PERMISSIONS] };
    return this._repository.fetch(this.uid, options).pipe(
      map((doc: DocumentModel) => {
        if (!this.contextParameters) {
          this.contextParameters = {};
        }
        this.contextParameters.permissions = doc.contextParameters.permissions;
        return this.contextParameters.permissions.indexOf(name) !== -1;
      }));
  }

  get properties(): any {
    return this._properties;
  }

  get filePath(): string {
    return this._properties['file:content'] === null || this._properties['file:content'] === undefined ? '' : this._properties['file:content'].data;
  }

  get fileMimeType(): string {
    return this._properties['file:content'] === null ? '' : this._properties['file:content']['mime-type'];
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

  get thumbnailUrl(): string {
    if (!this.facets.includes('Thumbnail') && this.isAudio()) {
      return this.getDefaultThumbnail();
    }
    return this.facets.includes('Thumbnail') && this.contextParameters && this.contextParameters.thumbnail ? this.contextParameters.thumbnail.url : this.getDefaultThumbnail();
  }

  get isFavorites(): boolean {
    return this.contextParameters && this.contextParameters.favorites ? this.contextParameters.favorites.isFavorite : null;
  }

  get previewUrl(): string {
    return this.contextParameters && this.contextParameters.preview ? this.contextParameters.preview.url : '';
  }

  get subTypes(): string[] {
    return this.contextParameters && this.contextParameters.subtypes ? this.contextParameters.subtypes : [];
  }

  get contextParameters(): any {
    return this._contextParameters;
  }

  set contextParameters(contextParameters: any) {
    this._contextParameters = contextParameters;
  }

  get videoPoster(): string {
    return this.pictureViews('StaticPlayerView');
  }

  get originalPicture(): string {
    return this.pictureViews('OriginalJpeg');
  }

  get fullHDPicture(): string {
    return this.pictureViews('FullHD');
  }
  // 'Thumbnail', 'Small', 'Medium', 'FullHD', 'OriginalJpeg'
  pictureViews(title: string): string {
    const picture = this.get('picture:views').filter((item: any) => item.title === title).map((p: any) => p.content.data).shift();
    return picture || this.thumbnailUrl;
  }

  get attachedImage(): string {
    const images = this.get('files:files').filter((item: any) => item.file['mime-type'].includes('image')).map((p: any) => p.file.data);
    return images[0] || this.pictureViews('FullHD');
  }

  get(propertyName: string): any {
    return this.properties[propertyName];
  }

  getVideoSources(): { url: string, type: string }[] {
    const sources = this.get('vid:transcodedVideos');
    if (sources.length !== 0) {
      return sources.map((conversion: any) => {
        return {
          url: conversion.content.data,
          type: conversion.content['mime-type'],
        };
      });
    } else {
      return [{
        url: this.filePath,
        type: '',
      }];
    }
  }

  hasFacet(facet: string): boolean {
    return this.facets.indexOf(facet) !== -1;
  }

  isPdf(): boolean {
    return this.fileMimeType === 'application/pdf' ||
      (this.get('picture:info') && this.get('picture:info').format && this.get('picture:info').format.includes('PDF' || 'JPEG' || 'GIF'));
  }

  isAudio(): boolean {
    if (this.get('vid:info') && this.get('vid:info').streams && this.get('vid:info').duration > 1) {
      if (this.get('vid:info').format.includes('mp3')) {
        return true;
      }
    }
    return false;
    // return this.hasFacet('Audio');
  }

  isVideo(): boolean {
    if (this.get('vid:info') && this.get('vid:info').streams && this.get('vid:info').duration > 1) {
      if (this.get('vid:info').format.includes('mp4' || 'mov' || 'm4a' || '3gp' || '3g2' || 'mj2')) {
        return true;
      }
    }
    return false;
    // return this.hasFacet('Video') && this.fileMimeType.includes('video');
  }

  isPicture(): boolean {
    return (this.hasFacet('Picture') && this.fileMimeType.includes('image')) ||
      (this.get('picture:info') && this.get('picture:info').format && this.get('picture:info').format.includes('PNG'));
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

  newInstance(type: string): DocumentModel {
    return new DocumentModel({ path: this.uid, type: type });
  }

  private getDefaultThumbnail(): string {
    return this.assetPath + 'assets/images/no-thumbnail.png';
  }
}
