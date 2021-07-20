import { NuxeoUploadResponse } from '@core/api';
import { DynamicFormModel } from '@core/custom';
import { DynamicInputModel } from '@core/custom/ng-dynamic-forms/model/input/dynamic-input.model';
import { Observable, of as observableOf } from 'rxjs';

export class BatchUploadStatus {

  uploaded: boolean = false;

  uploading: boolean = false;

  constructor(data: any = {}) {
    this.update(data);
  }

  update(params: any = {}): this {
    Object.assign(this, params);
    return this;
  }

  disableDeleteButton(): boolean {
    return this.uploaded || this.uploading;
  }

  disableUploadButton(): boolean {
    return this.uploaded || this.uploading;
  }
}

export class BatchUploadSettings {

  uploadZoneTitle: string = ':queueSize file(s) queued for upload';

  formMode: 'create' | 'edit' | 'view' = 'create';

  enableForm: boolean = false;

  enableAction: boolean = false;

  formModel: DynamicFormModel = [
    new DynamicInputModel({
      id: 'dc:title',
      maxLength: 150,
      placeholder: `Asset title`,
      autoComplete: 'off',
      required: false,
      validators: {
        required: null,
        minLength: 4,
      },
      errorMessages: {
        required: '{{placeholder}} is required',
        minLength: 'At least 4 characters',
      },
    }),
  ];

  onFilesChangedFn: (items: NuxeoUploadResponse[]) => Observable<NuxeoUploadResponse[]> = (items: NuxeoUploadResponse[]) => observableOf(items);

  constructor(data: any = {}) {
    Object.assign(this, data);
  }

}
