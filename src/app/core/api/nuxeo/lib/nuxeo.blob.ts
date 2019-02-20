
export class NuxeoBlob {

  content: any;
  name: string;
  mimeType: string;
  size: number;

  constructor(opts: any = {}) {
    this.content = opts.content;
    this.name = opts.name || this.content.name;
    this.mimeType = opts.mimeType || this.content.type;
    this.size = opts.size || this.content.size;
  }
}
