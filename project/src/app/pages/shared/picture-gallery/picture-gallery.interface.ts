
export class PictureGallerySettings {

  enableTitle: boolean = false;

  enableOuterLink: boolean = false;

  enableVideoAutoplay: boolean = false;

  assetUrl: string = '';

  galleryConfig: any = {
    playerInterval: 5000,
    autoPlay: true,
    dots: true,
    dotsSize: 10,
    loop: true,
    thumb: false,
  };

  constructor(opts: any = {}) {
    this.update(opts);
  }

  update(opts: any = {}): this {
    Object.assign(this, opts);
    return this;
  }
}
