import { GlobalDocumentDialogSettings } from '../global-document-dialog/global-document-dialog.interface';
import { DocumentModel } from '@core/api';

export class ListSearchRowCustomViewSettings {

  [key: string]: any;

  enableClick: boolean = true;

  dialogTitle: string = ':docTitle';

  htmlFunc: Function = (doc: DocumentModel): string => doc.title;

  viewType: 'button' | 'thumbnail' | 'icon' | 'html' | 'usage-rights-expiry' = 'thumbnail';

  dialogSettings: GlobalDocumentDialogSettings;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}
