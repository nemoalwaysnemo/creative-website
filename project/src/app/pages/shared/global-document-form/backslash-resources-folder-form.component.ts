import { Component } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel, DynamicDatepickerDirectiveModel, DynamicDragDropFileZoneModel, DynamicCheckboxModel } from '@core/custom';
import { DocumentFormEvent, DocumentFormSettings } from '../document-form/document-form.interface';
import { GlobalDocumentFormComponent } from './global-document-form.component';
import { DocumentPageService } from '../services/document-page.service';
import { SuggestionSettings } from '../document-form-extension';

@Component({
  selector: 'backslash-resources-folder-form',
  template: `<document-form [currentUser]="currentUser" [document]="document" [settings]="formSettings" [beforeSave]="beforeSave" [afterSave]="afterSave" (callback)="onCallback($event)"></document-form>`,
})
export class BackslashResourcesFolderFormComponent extends GlobalDocumentFormComponent {

  static readonly NAME: string = 'backslash-resources-folder-form';

  protected documentType: string = 'App-Backslash-Resources-Assetfolder';

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  protected beforeOnCreation(doc: DocumentModel, user: UserModel, formSettings: DocumentFormSettings): Observable<DocumentModel> {
    return this.initializeDocument(doc, this.getDocType());
  }

  protected beforeOnCallback(event: DocumentFormEvent): Observable<DocumentFormEvent> {
    if (event.action === 'Created') {
      event.redirectUrl = '/p/backslash/resource/folder/:uid';
    }
    return observableOf(event);
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
      new DynamicInputModel({
        id: 'dc:description',
        label: 'Description',
      }),
      new DynamicDatepickerDirectiveModel<string>({
        id: 'The_Loupe_ProdCredits:production_date',
        label: 'Date',
        readonly: false,
        defaultValue: (new Date()),
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
      new DynamicInputModel({
        id: 'The_Loupe_Main:assettype',
        label: 'Asset Type',
        hidden: true,
        disabled: true,
        required: true,
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:backslash_category',
        label: 'Backslash Category',
        required: false,
        settings: {
          placeholder: 'Select a value',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Backslash-Categories',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:Tags_edges',
        label: '\\Edges',
        required: true,
        settings: {
          placeholder: 'Select a value',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Edges-Edges',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicCheckboxModel({
        id: 'app_global:set_defaults',
        label: 'Set Defaults',
        readOnly: true,
        disabled: true,
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAssetZone',
        formMode: 'create',
        layoutPosition: 'right',
        settings: {
          queueLimit: 1,
          xpath: 'file:content',
          placeholder: 'Drop Image/PDF/Video File(s) here!',
          acceptTypes: 'image/*,.pdf,.mp4',
        },
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAssetZone',
        formMode: 'edit',
        layoutPosition: 'right',
        settings: {
          queueLimit: 1,
          xpath: 'file:content',
          placeholder: 'Drop Image/PDF/Video File(s) here!',
          acceptTypes: 'image/*,.pdf,.mp4',
        },
      }),
      new DynamicBatchUploadModel<string>({
        id: 'batchUpload',
        layoutPosition: 'bottom',
        formMode: 'create',
        settings: {
          enableInput: false,
          multiUpload: false,
        },
      }),
      new DynamicBatchUploadModel<string>({
        id: 'batchUpload',
        layoutPosition: 'bottom',
        formMode: 'edit',
        settings: {
          enableInput: false,
          multiUpload: true,
        },
      }),
    ];
  }
}
