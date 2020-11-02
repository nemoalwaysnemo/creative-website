
export class DocumentVideoSettings {

  poster: string;

  docUid: string;

  videoSources: any;

  mute: boolean = false;

  autoplay: boolean = true;

  enableGlobalMute: boolean = false;

  constructor(data: any = {}) {
    this.update(data);
  }

  update(params: any = {}): this {
    Object.assign(this, params);
    return this;
  }

}
