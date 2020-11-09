export class GalleryImageItem {
  selected: boolean = false;
  uploding: boolean = false;
  uploaded: boolean = false;
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
    return this.base64 ? this.getDataUrl() : this.src;
  }

  getDataUrl(): string {
    return this.toDataUrl(this.base64, this.getExtension(this.src));
  }

  getFile(): File {
    return this.dataUrl2File(this.getDataUrl(), this.getName());
  }

  private toDataUrl(data: string, type: string): string {
    return `data:image/${type};base64,${data}`;
  }

  private getExtension(file: string): string {
    return file.slice((Math.max(0, file.lastIndexOf('.')) || Infinity) + 1).split('!').shift();
  }

  private dataUrl2File(dataUrl: string, filename: string, type?: string): File {
    const data = dataUrl.split(',')[1];
    const mimePattern = /^data:(.*?)(;base64)?,/;
    const mime = dataUrl.match(mimePattern)[1];
    const binStr = atob(data);
    const u8arr = new Uint8Array(binStr.length);
    for (let i = 0; i < binStr.length; i++) {
      u8arr[i] = binStr.charCodeAt(i);
    }
    return new File([u8arr], filename, { type: type || mime });
  }

}

export class GalleryUploadStatus {

  selected: boolean = false;

  uploaded: boolean = false;

  uploading: boolean = false;

  constructor(data: any = {}) {
    this.update(data);
  }

  update(params: any = {}): this {
    Object.assign(this, params);
    return this;
  }

  disableUploadButton(): boolean {
    return !this.selected || (this.uploaded || this.uploading);
  }

}

export class GalleryUploadSettings {
  queueLimit: number = 1;
  uploadType: 'asset' | 'attachment';
  formMode: 'create' | 'edit' | 'view' = 'create';

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}
