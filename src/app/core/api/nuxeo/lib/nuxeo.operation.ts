import { join, encodePath } from '../../../services';
import { NuxeoResponse, NuxeoBlob } from './base.interface';
import { Observable } from 'rxjs';
import { Base } from './base.api';
import { isDocument, isBatch, isBatchUpload, isBatchBlob } from './nuxeo.utils';

export class Operation extends Base {

  private _id: string;
  private _url: string;
  private _automationParams: any;

  constructor(opts: any = {}) {
    const options = Object.assign({}, opts);
    super(options);
    this._id = options.id;
    this._url = this.automationUrl;
    this._nuxeo = options.nuxeo;
    this._automationParams = {
      params: {},
      context: {},
      input: undefined,
    };
  }

  param(name: string, value: any): this {
    this._automationParams.params[name] = value;
    return this;
  }

  params(params: {}): this {
    this._automationParams.params = Object.assign({}, this._automationParams.params, params);
    return this;
  }

  context(context: any): this {
    this._automationParams.context = context;
    return this;
  }

  input(input: any): this {
    this._automationParams.input = input;
    return this;
  }

  execute(opts: any = {}): Observable<NuxeoResponse> {
    opts.headers = opts.headers || {};
    opts.headers['Content-Type'] = this._computeContentTypeHeader(this._automationParams.input);
    const options = this._computeOptions(opts);
    let finalOptions = {
      method: 'POST',
      url: this._computeRequestURL(),
      body: this._computeRequestBody(),
    };
    finalOptions = Object.assign({}, options, finalOptions);
    return this._nuxeo.http(finalOptions);
  }

  _computeContentTypeHeader(input: any) {
    let contentType = 'application/json+nxrequest';
    if (this._isMultipartInput(input)) {
      contentType = 'multipart/form-data';
    } else if (isBatch(input)) {
      contentType = 'application/json';
    }
    return contentType;
  }

  _computeRequestURL(): string {
    const input = this._automationParams.input;
    if (isBatchBlob(input)) {
      return join(this.restUrl, 'upload', input['upload-batch'], input['upload-fileId'], 'execute', this._id);
    } else if (isBatchUpload(input)) {
      return join(this.restUrl, 'upload', input._batchId, 'execute', this._id);
    }
    return join(this._url, encodePath(this._id));
  }

  _computeRequestBody(): any {
    const input = this._automationParams.input;
    if (isBatch(input)) {
      // no input needed
      const body = Object.assign({}, this._automationParams);
      body.input = undefined;
      return body;
    }
    if (input instanceof Array) {
      if (input.length > 0) {
        const first = input[0];
        if (isDocument(first)) {
          // assume document list
          const docs = input.map((doc) => doc.uid);
          this._automationParams.input = `docs:${docs.join(',')}`;
          return this._automationParams;
        } else if (typeof first === 'string') {
          // assume ref list
          this._automationParams.input = `docs:${input.join(',')}`;
          return this._automationParams;
        } else if (first instanceof NuxeoBlob) {
          // blob list => multipart
          const automationParams = {
            params: this._automationParams.params,
            context: this._automationParams.context,
          };
          const form = new FormData();
          form.append('params', JSON.stringify(automationParams));

          let inputIndex = 0;
          // eslint-disable-next-line prefer-const
          for (const blob of input) {
            form.append(`input#${inputIndex}`, blob.content, blob.name);
            inputIndex += 1;
          }
          return form;
        }
      }
    } else if (isDocument(input)) {
      this._automationParams.input = input.uid;
      return this._automationParams;
    } else if (input instanceof NuxeoBlob) {
      const automationParams = {
        params: this._automationParams.params,
        context: this._automationParams.context,
      };
      const form = new FormData();
      form.append('params', JSON.stringify(automationParams));
      form.append('input', input.content, input.name);
      return form;
    }
    return this._automationParams;
  }

  _isMultipartInput(input: any): boolean {
    if (input instanceof Array) {
      if (input.length > 0) {
        const first = input[0];
        if (first instanceof NuxeoBlob) {
          return true;
        }
      }
    } else if (input instanceof NuxeoBlob) {
      return true;
    }
    return false;
  }

}
