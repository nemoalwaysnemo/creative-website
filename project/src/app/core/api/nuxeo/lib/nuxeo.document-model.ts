import { Base } from './base.api';
import { join, deepExtend, mapOrder, isValueEmpty } from '../../../services/helpers';
import { NuxeoEnricher, BatchBlob, NuxeoAutomations } from './base.interface';
import { Observable, of as observableOf } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export class DocumentModel extends Base {

  private _properties: any = {};
  private _dirtyProperties: any = {};
  private _contextParameters: any;
  private _facets: string;
  private _repository: any;
  private cache: Map<string, DocumentModel> = new Map<string, DocumentModel>();

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

  // delete(opts: any = {}): Observable<DocumentModel> {
  //   const options = this._computeOptions(opts);
  //   return this._repository.delete(this.path);
  // }

  moveToTrash(params: any = {}): Observable<DocumentModel> {
    const input = `doc:${this.uid}`;
    const op = this._nuxeo.operation(NuxeoAutomations.MoveToTrash);
    return op.input(input).params(params).execute();
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

  fetchDocument(uid: string, opts: any = {}): Observable<DocumentModel> {
    const options = this._computeOptions(opts);
    options.enrichers = { document: [NuxeoEnricher.document.THUMBNAIL] };
    options.schemas = ['dublincore', 'app_global', 'app_Edges', 'The_Loupe_Main'];
    return this._repository.fetch(uid, options);
  }

  setParent(doc: DocumentModel, key: string = 'parent'): void {
    this.setCache(key, doc);
  }

  getParent(key: string = 'parent'): DocumentModel {
    return this.getCache(key);
  }

  getParentPropertyByOperation(propertyName: string, key: string = 'parent'): Observable<any> {
    if (this.hasCache(key)) {
      return observableOf(this.getParent(key).get(propertyName));
    }
    const op = this._nuxeo.operation(NuxeoAutomations.GetDocument);
    return op.schemas('*').params({ uuid: this.parentRef }).execute().pipe(
      tap((doc: DocumentModel) => { this.setParent(doc, key); }),
      map((doc: DocumentModel) => doc.get(propertyName)),
    );
  }

  getParentProperty(propertyName: string, key: string = 'parent'): Observable<any> {
    if (this.hasCache(key)) {
      return observableOf(this.getParent(key).get(propertyName));
    }
    return this.fetchDocument(this.parentRef).pipe(
      tap((doc: DocumentModel) => { this.setParent(doc, key); }),
      map((doc: DocumentModel) => doc.get(propertyName)),
    );
  }

  filterParents(docType: string[]): DocumentModel[] {
    return (this.breadcrumb || []).filter((doc: DocumentModel) => docType.includes(doc.type));
  }

  get options(): any {
    return { nuxeo: this._nuxeo, repository: this._repository };
  }

  get hasAnyContent(): boolean {
    return this.contextParameters['hasContent'] === undefined ? true : this.contextParameters.hasContent;
  }

  get properties(): any {
    return this._properties;
  }

  set properties(properties: any) {
    this._properties = properties;
  }

  get fileContent(): any {
    return this._properties['file:content'] === null || this._properties['file:content'] === undefined ? {} : this._properties['file:content'];
  }

  get fileName(): string {
    return this.fileContent['name'];
  }

  get filePath(): string {
    return this.fileContent['data'];
  }

  get fileMimeType(): string {
    return this.fileContent['mime-type'];
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

  get hasFolderishChild(): boolean {
    return this.contextParameters && this.contextParameters.hasFolderishChild ? true : false;
  }

  get breadcrumb(): DocumentModel[] {
    const documents = this.contextParameters && this.contextParameters.breadcrumb ? this.contextParameters.breadcrumb.entries : [];
    return documents.map((doc: DocumentModel) => new DocumentModel(doc));
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

  get thumbnailPicture(): string {
    return this.pictureViews('Thumbnail');
  }

  get smallPicture(): string {
    return this.pictureViews('Small');
  }
  // 'Thumbnail', 'Small', 'Medium', 'FullHD', 'OriginalJpeg'
  pictureViews(type: string): string {
    const picture = (this.get('picture:views') || []).filter((item: any) => item.title === type).map((p: any) => p.content.data).shift();
    return picture || this.thumbnailUrl;
  }

  get attachedImage(): string {
    const images = (this.get('files:files') || []).filter((item: any) => item.file['mime-type'].includes('image')).map((p: any) => p.file.data);
    return images[0] || this.pictureViews('FullHD');
  }

  get(propertyName: string): any {
    return this.properties[propertyName];
  }

  getCustomFile(propertyName: string, defaultThumbnail: boolean = true): string {
    const value = this.get(propertyName);
    return isValueEmpty(value) ? (defaultThumbnail ? this.getDefaultThumbnail() : '') : value.data;
  }

  getCustomFiles(propertyName: string): { url: string, type: string, name: string }[] {
    const list: { url: string, type: string, name: string }[] = [];
    const value = this.get(propertyName);
    if (value && Array.isArray(value) && !isValueEmpty(value)) {
      for (const file of value) {
        list.push({ url: file.data, type: file['mime-type'], name: file.name });
      }
    }
    return list;
  }

  getAttachmentList(): { type: string, url: string, title: string }[] {
    return (this.get('files:files') || []).filter((entry: any) => entry && entry.file).map((entry: any) => ({ type: entry.file['mime-type'], url: entry.file.data, title: entry.file.name }));
  }

  hasVideoContent(): boolean {
    return this.getVideoSources().length > 0;
  }

  getVideoSources(): { url: string, type: string, name: string }[] {
    const sources = this.get('vid:transcodedVideos');
    if (!!sources && sources.length !== 0) {
      return mapOrder(sources, ['MP4 480p', 'WebM Original', 'WebM 480p'], 'name').map((video: any) => {
        return { url: video.content.data, type: video.content['mime-type'], name: video.name };
      });
    } else {
      return [{ url: this.filePath, type: this.fileMimeType, name: this.fileName }];
    }
  }

  getCarouselVideoSources(): { url: string, type: string, name: string }[] {
    const sources = this.get('vid:transcodedVideos') || [];
    const webMOriginal = sources.find((x: any) => x.name === 'WebM Original');
    if (webMOriginal) {
      return [{ url: webMOriginal.content.data, type: webMOriginal.content['mime-type'], name: webMOriginal.name }];
    } else if (this.filePath) {
      return [{ url: this.filePath, type: this.fileMimeType, name: this.fileName }];
    } else if (sources.length !== 0) {
      return mapOrder(sources, ['WebM Original', 'MP4 480p', 'WebM 480p'], 'name').map((video: any) => {
        return { url: video.content.data, type: video.content['mime-type'], name: video.name };
      });
    } else {
      return [{ url: '', type: '', name: '' }];
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
    if (this.fileContent && this.filePath && this.fileContent['mime-type'] && this.fileContent['mime-type'].includes('audio')) {
      return true;
    }
    return false;
  }

  isVideo(): boolean {
    if (this.get('vid:info') && this.get('vid:info').streams && this.get('vid:info').duration > 1) {
      if (this.get('vid:info').format.includes('mp4' || 'mov' || 'm4a' || '3gp' || '3g2' || 'mj2')) {
        return true;
      }
    }
    if (this.fileContent && this.filePath && this.fileContent['mime-type'] && this.fileContent['mime-type'].includes('video')) {
      return true;
    }
    return false;
    // return this.hasFacet('Video') && this.fileMimeType.includes('video');
  }

  isPicture(): boolean {
    return (this.hasFacet('Picture') && this.fileMimeType && this.fileMimeType.includes('image')) ||
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

  openLinkInNewTab(): boolean {
    return this.get('app_global:ext_app_newtab');
  }

  openLinkInIframe(): boolean {
    return this.get('app_global:ext_app_iframe');
  }

  newInstance(type: string): DocumentModel {
    return new DocumentModel({ path: this.uid, type });
  }

  private getDefaultThumbnail(): string {
    return '/assets/images/no-thumbnail.png';
  }

  private getCache(key: string): DocumentModel {
    return this.cache.get(key);
  }

  private setCache(key: string, value: any): void {
    this.cache.set(key, value);
  }

  private hasCache(key: string): boolean {
    return this.cache.has(key);
  }

}
