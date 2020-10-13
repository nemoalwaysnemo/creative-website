import { Component } from '@angular/core';
import { DocumentModel } from '@core/api';
import { Observable } from 'rxjs';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel, DynamicOptionTagModel, DynamicDatepickerDirectiveModel, DynamicDragDropFileZoneModel, DynamicCheckboxModel } from '@core/custom';
import { GlobalDocumentFormComponent } from './global-document-form.component';
import { SuggestionSettings } from '../directory-suggestion/directory-suggestion-settings';
import { DocumentFormEvent } from '../document-form/document-form.interface';
import { DocumentPageService } from '../services/document-page.service';
import { NUXEO_PATH_INFO } from '@environment/environment';

@Component({
  selector: 'innovation-folder-form',
  template: `<document-form [currentUser]="currentUser" [document]="document" [settings]="formSettings$ | async" [models]="formModels" [layout]="formLayout" [beforeSave]="beforeSave" [afterSave]="afterSave" (callback)="onCallback($event)"></document-form>`,
})
export class InnovationFolderFormComponent extends GlobalDocumentFormComponent {

  static readonly NAME: string = 'innovation-folder-form';

  protected documentType: string = 'App-Innovation-Folder';

  protected documentPath: string;

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  protected beforeOnCreation(doc: DocumentModel): Observable<DocumentModel> {
    this.buildDocumentPath(doc);
    return this.initializeDocument(doc, this.getDocType());
  }

  protected beforeOnCallback(event: DocumentFormEvent): DocumentFormEvent {
    if (event.action === 'Created') {
      event.redirectUrl = this.documentPath + '/:uid';
    }
    return event;
  }

  protected buildDocumentPath(doc: DocumentModel): void {
    if (doc) {
      if (doc.path.includes(NUXEO_PATH_INFO.INNOVATION_BASE_FOLDER_PATH + 'NEXT')) {
        this.documentPath = '/p/innovation/NEXT/folder';
      } else if (doc.path.includes(NUXEO_PATH_INFO.INNOVATION_BASE_FOLDER_PATH + 'Things to Steal')) {
        this.documentPath = '/p/innovation/Things to Steal/folder';
      }
    }
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
        required: false,
        validators: {
          dateFormatValidator: null,
        },
        errorMessages: {
          dateFormatValidator: 'Invalid {{label}}. Valid Format MMM D, YYYY',
        },
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Main:assettype',
        label: 'Asset Type',
        readOnly: true,
        disabled: true,
        required: false,
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:created_by',
        label: 'Author',
        required: false,
        placeholder: 'Author',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:agency',
        label: 'Agency',
        settings: {
          multiple: false,
          placeholder: 'Select a value',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Agencies',
        },
        required: false,
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:country',
        label: 'Country',
        settings: {
          placeholder: 'Select a value',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Countries',
        },
        required: false,
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:brand',
        label: 'Brand',
        required: false,
        placeholder: 'Brand',
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:industry',
        label: 'Industry',
        required: false,
        settings: {
          placeholder: 'Select a value',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Industries',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:Tags_edges',
        label: 'Edges',
        settings: {
          placeholder: 'Select a value',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Edges-Edges',
        },
        required: false,
      }),
      // new DynamicCheckboxModel({
      //   id: 'app_global:ext_app_iframe',
      //   label: 'Enable external App iframe',
      // }),
      // new DynamicCheckboxModel({
      //   id: 'app_global:ext_app_newtab',
      //   label: 'Enable external App in new tab',
      // }),
      // new DynamicInputModel({
      //   id: 'The_Loupe_Main:url',
      //   label: 'external Application URL',
      //   autoComplete: 'off',
      //   required: false,
      // }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAssetZone',
        formMode: 'create',
        uploadType: 'asset',
        layoutPosition: 'right',
        queueLimit: 1,
        placeholder: 'Drop Folder Image here! This will become the thumbnail for the new folder.',
        acceptTypes: 'image/*,.pdf',
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAssetZone',
        formMode: 'edit',
        uploadType: 'asset',
        layoutPosition: 'right',
        queueLimit: 1,
        placeholder: 'Drop Image/PDF here!',
        acceptTypes: 'image/*,.pdf',
      }),
      new DynamicBatchUploadModel<string>({
        id: 'files:files',
        layoutPosition: 'bottom',
        formMode: 'create',
        showInputs: false,
        multiUpload: false,
      }),
      new DynamicBatchUploadModel<string>({
        id: 'files:files',
        layoutPosition: 'bottom',
        formMode: 'edit',
        showInputs: false,
        multiUpload: true,
      }),
    ];
  }
}
