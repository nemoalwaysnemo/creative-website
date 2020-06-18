import { TemplateRef } from '@angular/core';
import { GlobalDocumentDialogSettings } from '../global-document-dialog/global-document-dialog.interface';

export class ListSearchRowCustomViewSettings {

  [key: string]: any;

  dialogTitle: string = ':docTitle';

  templateRef: TemplateRef<any>;

  enableClick: boolean = true;

  viewType: 'button' | 'thumbnail' = 'thumbnail';

  dialogSettings: GlobalDocumentDialogSettings;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}
