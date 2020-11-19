export class GalleryImageItem {
  selected: boolean = false;
  uploding: boolean = false;
  uploaded: boolean = false;
  private src: string;
  private name: string;
  private dataUrl: string;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }

  getName(): string {
    return this.name;
  }

  getSrc(): string {
    return this.src;
  }

  getSource(): string {
    return this.dataUrl || this.src;
  }

  getFile(): File {
    return this.dataUrl2File(this.dataUrl, this.getName());
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
