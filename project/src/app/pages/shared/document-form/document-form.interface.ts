import { DocumentModel, NuxeoUploadResponse } from '@core/api';
import { DynamicFormModel } from '@core/custom';
import { isValueEmpty } from '@core/services/helpers';
import { Observable, of as observableOf } from 'rxjs';

export class DocumentFormEvent {
  [key: string]: any;
  action: string;
  messageType: 'info' | 'success' | 'warning' | 'error' = 'info';
  messageContent: string;
  redirectUrl: string;
  docs: DocumentModel[] = [];
  doc: DocumentModel;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }

  getRedirectUrl(doc: DocumentModel | DocumentModel[]): string {
    if (doc) {
      return this.redirectUrl ? this.redirectUrl.replace(':uid', this.getDoc(doc).uid) : '';
    }
    return '';
  }

  getDoc(doc: DocumentModel | DocumentModel[]): DocumentModel {
    return Array.isArray(doc) ? doc[0] : doc;
  }
}

export class DocumentFormStatus {

  submitted: boolean = false;

  submitting: boolean = false;

  formValid: boolean = true;

  childrenValid: boolean = true;

  uploadState: 'prepared' | 'uploading' | 'uploaded' | null;

  constructor(data: any = {}) {
    this.update(data);
  }

  update(params: any = {}): this {
    Object.assign(this, params);
    return this;
  }

  disableSaveButton(): boolean {
    return ['uploading'].includes(this.uploadState) || this.submitting || this.submitted || !this.formValid || !this.childrenValid;
  }
}

export class DocumentImportSettings {

  placeholder: string = 'Drop files here!';

  acceptTypes: string = '*';

  queueLimit: number = 10;

  initializeDocument: boolean = true;

  getDocType(item: NuxeoUploadResponse): string {
    throw new Error(`unknown document type for '${item.fileName}'`);
  }

  constructor(data: any = {}) {
    Object.assign(this, data);
    return this;
  }
}

export class DocumentFormSettings {

  formName: string;

  actionOptions: any = {};

  formModel: DynamicFormModel = [];

  importSettings: DocumentImportSettings = new DocumentImportSettings();

  accordionSettings: { name: string, position?: string, visibleFn?: any }[] = [];

  switchTabSettings: { name: string, disabledFn?: any, visibleFn?: any, active: boolean }[] = [];

  enableLayoutRight: boolean = true;

  enableButtons: boolean = true;

  enableBulkImport: boolean = false;

  resetFormAfterDone: boolean = false;

  showUploadMessage: boolean = false;

  showMessageBeforeSave: boolean = true;

  formMode: 'create' | 'edit' | 'view' = 'create';

  buttonGroup: any[] = [
    {
      label: 'Save',
      name: 'save',
      type: 'save',
    },
    // {
    //   label: 'Test',
    //   name: 'test button',
    //   type: 'custom',
    //   disabled: (status: DocumentFormStatus) => false,
    //   // disabled: (status: DocumentFormStatus) => status.disableSaveButton(),
    // },
    {
      label: 'Cancel',
      name: 'cancle',
      type: 'cancle',
    },
  ];

  constructor(data: any = {}) {
    if (!isValueEmpty(data.importSettings)) {
      this.importSettings = new DocumentImportSettings(data.importSettings);
      delete data.importSettings;
    }
    this.update(data);
  }

  update(params: any = {}): this {
    Object.assign(this, params);
    return this;
  }

}
