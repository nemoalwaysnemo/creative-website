import { Base } from './base.api';

export class DocumentModel extends Base {

  private _properties: any;
  private _facets: string;
  private _uid: any;
  private _contextParameters: any;

  title: string;

  constructor(doc: any = {}, opts: any = {}) {
    super(opts);
    this._properties = {};
    Object.assign(this, doc);
  }

  get properties(): any {
    return this._properties;
  }

  get fileMimeType(): string {
    return this._properties['file:content']['mime-type'];
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
    return this.contextParameters && this.contextParameters.thumbnail ? this.contextParameters.thumbnail.url : 'assets/images/default.jpg';
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

  getVideoSources(typeList: string[] = []) {
    const sources = this.get('vid:transcodedVideos') || [];
    return sources.filter(item => typeList.includes(item.name)).map(function (conversion) {
      return {
        src: conversion.content.data,
        type: conversion.content['mime-type'],
      };
    });
  }

  hasFacet(facet: string): boolean {
    return this.facets.indexOf(facet) !== -1;
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
