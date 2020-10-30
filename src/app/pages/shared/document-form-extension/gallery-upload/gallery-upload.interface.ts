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
    return file.split('.').pop();
  }

}

export class GalleryUploadSettings {

  multiUpload: boolean = false;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}
