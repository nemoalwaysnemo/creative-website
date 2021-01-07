import { DocumentModel } from '@core/api';

export class DocumentViewerSettings {

  styleName: string;

  mute: boolean = false;

  autoplay: boolean = true;

  documentModel: DocumentModel;

  enableStoryboard: boolean = false;

  enableGlobalMute: boolean = false;

  layout: 'dialogSlides' | 'slides' = 'slides';

  controls: string = 'controls';

  preload: string = 'auto';

  posterFn: any = (doc: DocumentModel): string => doc.videoPoster;

  videoSourceFn: any = (doc: DocumentModel): any[] => doc.getVideoSources();

  srcFn: any = (doc: DocumentModel): string => (doc.fullHDPicture ? doc.fullHDPicture : '/assets/images/default.jpg');

  constructor(data: any = {}) {
    this.update(data);
  }

  update(params: any = {}): this {
    Object.assign(this, params);
    return this;
  }

  set document(doc: DocumentModel) {
    this.documentModel = doc;
  }

  get document(): DocumentModel {
    return this.documentModel;
  }

  get docUid(): string {
    return this.documentModel.uid;
  }

  get poster(): string {
    return this.posterFn(this.documentModel);
  }

  get videoSources(): any[] {
    return this.videoSourceFn(this.documentModel);
  }

  get src(): string {
    return this.srcFn(this.documentModel);
  }

}
