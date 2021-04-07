import { DocumentModel } from '@core/api';
import { DynamicFormLayout, DynamicFormModel } from '@core/custom';

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

  formValid: boolean = true;

  childrenValid: boolean = true;

  uploadState: 'preparing' | 'uploading' | 'uploaded' | null;

  constructor(data: any = {}) {
    this.update(data);
  }

  update(params: any = {}): this {
    Object.assign(this, params);
    return this;
  }

  disableSaveButton(): boolean {
    return ['preparing', 'uploading'].includes(this.uploadState) || this.submitted || !this.formValid || !this.childrenValid;
  }
}

export class DocumentFormSettings {

  actionOptions: any = {};

  formModel: DynamicFormModel = [];

  formLayout: DynamicFormLayout = {};

  accordionSettings: { name: string, position?: string, visibleFn?: any }[] = [];

  switchTabSettings: { name: string, disabledFn?: any, visibleFn?: any }[] = [];

  enableLayoutRight: boolean = true;

  enableButtons: boolean = true;

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
    this.update(data);
  }

  update(params: any = {}): this {
    Object.assign(this, params);
    return this;
  }

}
