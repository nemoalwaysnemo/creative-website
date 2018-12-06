
export class BatchBlob {

  constructor(opts: any = {}) {
    this['upload-batch'] = opts.batchId;
    this['upload-fileId'] = `${opts.index}`;
    delete opts.batchId;
    delete opts.index;
    Object.assign(this, opts);
  }

}
