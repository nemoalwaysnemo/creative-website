import { Component } from '@angular/core';
import { NuxeoUploadResponse } from '@core/api';
import { DynamicFormControlModel } from '@core/custom';
import { DynamicNGFormSettings } from '../document-form-extension/dynamic-ng-form';
import { BaseDocumentFormComponent } from './base-document-form.component';

@Component({
  selector: 'document-import',
  styleUrls: ['./document-form.component.scss'],
  templateUrl: './document-import.component.html',
})
export class DocumentImportComponent extends BaseDocumentFormComponent {

  protected onUploadFileSelected(uploadModel: DynamicFormControlModel, settings: DynamicNGFormSettings, res: NuxeoUploadResponse[]): void {

  }

}
