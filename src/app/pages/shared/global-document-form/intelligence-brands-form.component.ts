import { Component } from '@angular/core';
import { DocumentModel } from '@core/api';
import { Observable } from 'rxjs';
import { DynamicBatchUploadModel, DynamicInputModel, DynamicDragDropFileZoneModel, DynamicTextAreaModel } from '@core/custom';
import { GlobalDocumentFormComponent } from './global-document-form.component';
import { DocumentPageService } from '../services/document-page.service';

@Component({
  selector: 'intelligence-brands-form',
  template: `<document-form [currentUser]="currentUser" [document]="document" [settings]="formSettings$ | async" [models]="formModels" [layout]="formLayout" [beforeSave]="beforeSave" [afterSave]="afterSave" (callback)="onCallback($event)"></document-form>`,
})
export class IntelligenceBrandsFormComponent extends GlobalDocumentFormComponent {

  protected documentType: string = 'App-Intelligence-Brands-Folder';

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  protected beforeOnCreation(doc: DocumentModel): Observable<DocumentModel> {
    return this.initializeDocument(doc, this.getDocType());
  }

  protected getFormModels(): any[] {
    return [
      new DynamicInputModel({
        id: 'dc:title',
        label: 'Title',
        maxLength: 50,
        placeholder: 'Title',
        autoComplete: 'off',
        required: true,
        hidden: true,
        validators: {
          required: null,
          minLength: 4,
        },
        errorMessages: {
          required: '{{label}} is required',
          minLength: 'At least 4 characters',
        },
      }),
      new DynamicTextAreaModel({
        id: 'dc:description',
        label: 'Description',
        rows: 3,
        required: false,
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAssetZone',
        formMode: 'create',
        uploadType: 'asset',
        layoutPosition: 'left',
        queueLimit: 1,
        placeholder: 'Drop Image/PDF here!',
        acceptTypes: 'image/*,.pdf',
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAssetZone',
        formMode: 'edit',
        uploadType: 'asset',
        layoutPosition: 'left',
        queueLimit: 1,
        placeholder: 'Drop Image/PDF here!',
        acceptTypes: 'image/*,.pdf',
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAttachmentZone',
        formMode: 'edit',
        uploadType: 'attachment',
        layoutPosition: 'left',
        queueLimit: 1,
        placeholder: 'Drop to upload attachment',
        acceptTypes: 'image/*,.pdf,.key,.ppt,.zip,.doc,.xls,.mp4',
      }),
      new DynamicBatchUploadModel<string>({
        id: 'files:files',
        layoutPosition: 'bottom',
        formMode: 'create',
        multiUpload: false,
      }),
      new DynamicBatchUploadModel<string>({
        id: 'files:files',
        layoutPosition: 'bottom',
        formMode: 'edit',
        showInputs: false,
        multiUpload: false,
      }),
    ];
  }
}
