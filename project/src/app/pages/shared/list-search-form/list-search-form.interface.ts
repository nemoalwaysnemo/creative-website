import { GlobalDocumentDialogSettings } from '../global-document-dialog';
import { DocumentModel } from '@core/api';
import { Subject } from 'rxjs';

export class ListSearchRowCustomViewSettings {

  [key: string]: any;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }

  enableClick: boolean = true;

  dialogTitle: string = ':docTitle';

  viewType: 'button' | 'thumbnail' | 'icon' | 'html' | 'usage-rights-expiry' = 'thumbnail';

  dialogSettings: GlobalDocumentDialogSettings;

  dialogParams: Subject<any> = new Subject();

  htmlFn: (doc: DocumentModel) => string = (doc: DocumentModel) => doc.title;
}
