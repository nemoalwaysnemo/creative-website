
export class BatchUploadStatus {

  uploaded: boolean = false;

  uploading: boolean = false;

  constructor(data: any = {}) {
    this.update(data);
  }

  update(params: any = {}): this {
    Object.assign(this, params);
    return this;
  }

  disableDeleteButton(): boolean {
    return this.uploaded || this.uploading;
  }

  disableUploadButton(): boolean {
    return this.uploaded || this.uploading;
  }
}

export class BatchUploadSettings {

  showInput: boolean = false;

  multiUpload: boolean = false;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}
