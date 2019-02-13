import { Base } from './base.api';

export class DocumentModel extends Base {

  private _properties: any;
  private _facets: string;
  private _contextParameters: any;
  private _repository: any;
  private _dirtyProperties: any;
  uid: string;

  type: string;

  title: string;

  constructor(doc: any = {}, opts: any = {}) {
    super(opts);
    this._properties = {};
    this._nuxeo = opts.nuxeo;
    this._repository = opts.repository || this._nuxeo.repository(doc.repository, opts);
    this._dirtyProperties = {};
    Object.assign(this, doc);
  }

  set(properties) {
    this._dirtyProperties = Object.assign(this._dirtyProperties, properties);
    return this;
  }

  save(opts = {}) {
    const options = this._computeOptions(opts);
    return this._repository.update({
      'entity-type': 'document',
      uid: this.uid,
      properties: this._dirtyProperties,
    }, options);
  }


  get properties(): any {
    return this._properties;
  }

  get filePath(): string {
    return this._properties['file:content'] === null ? '' : this._properties['file:content'].data;
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
    const defaultUrl = 'assets/images/no-thumbnail.png';
    return this.facets.indexOf('Thumbnail') !== -1 && this.contextParameters && this.contextParameters.thumbnail ? this.contextParameters.thumbnail.url : defaultUrl;
  }

  get contextParameters(): any {
    return this._contextParameters;
  }

  set contextParameters(contextParameters: any) {
    this._contextParameters = contextParameters;
  }

  get videoPoster(): string {
    const pictures = this.get('picture:views');
    const poster = pictures.filter(item => item.title === 'StaticPlayerView').map(function (picture) { return picture.content.data; }).shift();
    return poster || this.thumbnailUrl;
  }

  get(propertyName: string): any {
    return this.properties[propertyName];
  }

  getVideoSources(): { url: string, type: string }[] {
    const sources = this.get('vid:transcodedVideos') || [];
    return sources.map((conversion: any) => {
      return {
        url: conversion.content.data,
        type: conversion.content['mime-type'],
      };
    });
  }

  hasFacet(facet: string): boolean {
    return this.facets.indexOf(facet) !== -1;
  }

  isAudio(): boolean {
    return this.hasFacet('Audio');
  }

  isVideo(): boolean {
    return this.hasFacet('Video');
  }

  isPicture(): boolean {
    return !this.isVideo() && this.hasFacet('Picture');
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

}
