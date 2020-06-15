import { GlobalDocumentDialogSettings } from '../global-document-dialog/global-document-dialog.interface';

export class ListSearchRowCustomViewSettings {

  dialogTitle: string = ':docTitle';

  enableClick: boolean = true;

  viewType: 'button' | 'thumbnail' = 'thumbnail';

  dialogSettings: GlobalDocumentDialogSettings;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}
