import { GlobalDocumentDialogSettings } from '../global-document-dialog/global-document-dialog.interface';

export class ListSearchRowCustomViewSettings {

  [key: string]: any;

  dialogTitle: string = ':docTitle';

  enableClick: boolean = true;

  viewType: 'button' | 'thumbnail' | 'usage-rights-expiry' = 'thumbnail';

  dialogSettings: GlobalDocumentDialogSettings;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}
