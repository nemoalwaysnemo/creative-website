import { GlobalDocumentDialogSettings } from '../global-document-dialog';
import { DocumentModel } from '@core/api';
import { Subject } from 'rxjs';

export class ListSearchRowCustomViewSettings {

  [key: string]: any;

  enableClick: boolean = true;

  dialogTitle: string = ':docTitle';

  htmlFunc: Function = (doc: DocumentModel): string => doc.title;

  viewType: 'button' | 'thumbnail' | 'icon' | 'html' | 'usage-rights-expiry' = 'thumbnail';

  dialogSettings: GlobalDocumentDialogSettings;

  dialogParams: Subject<any> = new Subject();

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}
