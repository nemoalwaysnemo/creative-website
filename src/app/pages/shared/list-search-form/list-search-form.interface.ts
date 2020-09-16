import { GlobalDocumentDialogSettings } from '../global-document-dialog';
import { DocumentModel } from '@core/api';

export class ListSearchRowCustomViewSettings {

  [key: string]: any;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }

  enableClick: boolean = true;

  dialogTitle: string = ':docTitle';

  viewType: 'button' | 'thumbnail' | 'icon' | 'html' | 'usage-rights-expiry' = 'thumbnail';

  dialogSettings: GlobalDocumentDialogSettings;

  htmlFunc: Function = (doc: DocumentModel): string => doc.title;
}
