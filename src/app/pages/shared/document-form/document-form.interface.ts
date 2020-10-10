import { DocumentModel } from '@core/api';

export class DocumentFormEvent {
  action: 'Created' | 'Updated' | 'Deleted' | 'Canceled';
  messageType: 'info' | 'success' | 'warning' | 'error';
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

export class DocumentFormSettings {

  enableButtons: boolean = true;

  resetFormAfterDone: boolean = false;

  showUploadMessage: boolean = false;

  formMode: 'create' | 'edit' | 'view' = 'create';

  constructor(data: any = {}) {
    Object.assign(this, data);
  }

}
