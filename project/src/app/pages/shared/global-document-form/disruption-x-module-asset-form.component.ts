import { Component } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { Observable } from 'rxjs';
import { DynamicBatchUploadModel, DynamicInputModel, DynamicOptionTagModel, DynamicDatepickerDirectiveModel, DynamicDragDropFileZoneModel, DynamicTextAreaModel } from '@core/custom';
import { GlobalDocumentFormComponent } from './global-document-form.component';
import { DocumentFormSettings } from '../document-form/document-form.interface';
import { DocumentPageService } from '../services/document-page.service';

@Component({
  selector: 'disruption-x-module-asset-form',
  template: `<document-form [currentUser]="currentUser" [document]="document" [settings]="formSettings" [beforeSave]="beforeSave" [afterSave]="afterSave" (callback)="onCallback($event)"></document-form>`,
})
export class DisruptionXModuleAssetFormComponent extends GlobalDocumentFormComponent {

  static readonly NAME: string = 'disruption-x-module-asset-form';

  protected documentType: string = 'App-DisruptionX-Module';

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  protected beforeOnCreation(doc: DocumentModel, user: UserModel, formSettings: DocumentFormSettings): Observable<DocumentModel> {
    return this.initializeDocument(doc, this.getDocType());
  }

  protected getFormModels(): any[] {
    return [
      new DynamicInputModel({
        id: 'dc:title',
        label: 'Title',
        maxLength: 150,
        placeholder: 'Title',
        autoComplete: 'off',
        required: true,
        validators: {
          required: null,
          minLength: 4,
        },
        errorMessages: {
          required: '{{label}} is required',
          minLength: 'At least 4 characters',
        },
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAssetZone',
        formMode: 'create',
        layoutPosition: 'left',
        settings: {
          queueLimit: 1,
          xpath: 'file:content',
          placeholder: 'Drop to upload Module Video',
          acceptTypes: '.mp4',
        },
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAssetZone',
        formMode: 'edit',
        layoutPosition: 'left',
        settings: {
          queueLimit: 1,
          xpath: 'file:content',
          placeholder: 'Drop to upload Module Video',
          acceptTypes: '.mp4',
        },
      }),
      new DynamicTextAreaModel({
        id: 'dc:description',
        label: 'Description',
        rows: 3,
        required: true,
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicDatepickerDirectiveModel<string>({
        id: 'The_Loupe_ProdCredits:production_date',
        label: 'Published',
        formMode: 'create',
        defaultValue: (new Date()),
        placeholder: 'Published',
        readonly: false,
        required: true,
        validators: {
          required: null,
          dateFormatValidator: null,
        },
        errorMessages: {
          required: '{{label}} is required',
          dateFormatValidator: 'Invalid {{label}}. Valid Format MMM D, YYYY',
        },
      }),
      new DynamicDatepickerDirectiveModel<string>({
        id: 'The_Loupe_ProdCredits:production_date',
        label: 'Published',
        formMode: 'edit',
        placeholder: 'Published',
        readonly: false,
        required: true,
        validators: {
          required: null,
          dateFormatValidator: null,
        },
        errorMessages: {
          required: '{{label}} is required',
          dateFormatValidator: 'Invalid {{label}}. Valid Format MMM D, YYYY',
        },
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:created_by',
        label: 'Author',
        required: false,
        placeholder: 'Author',
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAttachmentZone',
        formMode: 'edit',
        layoutPosition: 'right',
        settings: {
          queueLimit: 20,
          xpath: 'files:files',
          placeholder: 'Drop to upload attachment',
          acceptTypes: 'image/*,.pdf,.key,.ppt,.zip,.doc,.xls,.mp4',
        },
      }),
      new DynamicBatchUploadModel<string>({
        id: 'files:files',
        layoutPosition: 'bottom',
        formMode: 'create',
        settings: {
          showInput: false,
          multiUpload: false,
        },
      }),
      new DynamicBatchUploadModel<string>({
        id: 'files:files',
        layoutPosition: 'bottom',
        formMode: 'edit',
        settings: {
          showInput: false,
          multiUpload: true,
        },
      }),
    ];
  }

  protected getFormLayout(): any {
    return {
      'dc:title': {
        grid: {
          host: 'title',
        },
      },
      'dc:description': {
        grid: {
          host: 'asset-description',
        },
      },
      'The_Loupe_ProdCredits:production_date': {
        grid: {
          host: 'production-date',
        },
      },
      'The_Loupe_Main:created_by': {
        grid: {
          host: 'created-by',
        },
      },
      dragDropAttachmentZone: {
        grid: {
          host: 'drag-attachment',
        },
      },
    };
  }
}
