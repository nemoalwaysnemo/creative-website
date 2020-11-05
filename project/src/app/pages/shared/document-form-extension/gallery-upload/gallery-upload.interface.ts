export class GalleryImageItem {
  private src: string;
  private alt: string;
  private base64: string;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }

  getName(): string {
    return this.alt;
  }

  getSource(): string {
    return this.base64 ? this.base64ToSrc(this.base64, this.getExtension(this.src)) : this.src;
  }

  private base64ToSrc(data: string, type: string): string {
    return `data:image/${type};base64,${{ data }}`;
  }

  private getExtension(file: string): string {
    return file.slice((Math.max(0, file.lastIndexOf('.')) || Infinity) + 1).split('!').shift();
  }

}

export class GalleryUploadSettings {
  queueLimit: number = 1;
  uploadType: 'asset' | 'attachment';

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}
