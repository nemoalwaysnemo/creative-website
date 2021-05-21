import { NuxeoUploadResponse } from '@core/api';
import { DynamicFormModel } from '@core/custom';
import { of as observableOf, Observable } from 'rxjs';
import { DocumentFormSettings } from '../document-form/document-form.interface';

export class DocumentBulkImportSettings {

  formSettings: DocumentFormSettings = new DocumentFormSettings();

  formModel: DynamicFormModel = [];

  placeholder: string = 'Drop files here!';

  acceptTypes: string = '*';

  queueLimit: number = 10;

  onFilesChangedFn: (items: NuxeoUploadResponse[]) => Observable<NuxeoUploadResponse[]> = (items: NuxeoUploadResponse[]) => observableOf(items);

  constructor(data: any = {}) {
    Object.assign(this, data);
    return this;
  }

}
