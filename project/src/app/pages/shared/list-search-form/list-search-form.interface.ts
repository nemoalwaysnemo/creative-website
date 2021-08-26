import { GlobalDocumentDialogSettings } from '../global-document-dialog';
import { DocumentModel } from '@core/api';
import { Subject } from 'rxjs';

export class ListSearchRowCustomViewSettings {

  [key: string]: any;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }

  enableClick: boolean = true;

  enableDownloadRequest: boolean = false;

  dialogTitle: string = ':docTitle';

  placeholder: string = 'Details';

  viewType: 'button' | 'thumbnail' | 'icon' | 'html' | 'usage-rights-expiry' = 'thumbnail';

  dialogSettings: GlobalDocumentDialogSettings;

  dialogParams: Subject<any> = new Subject();

  htmlFn: (doc: DocumentModel) => string = (doc: DocumentModel) => doc.title;

  downloadRequestFn: (doc: DocumentModel) => boolean = (doc: DocumentModel) => doc.get('app_global:asset_request') === true;

}
