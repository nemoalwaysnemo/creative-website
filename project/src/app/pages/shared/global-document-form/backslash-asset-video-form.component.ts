import { Component } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { Observable } from 'rxjs';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel, DynamicOptionTagModel, DynamicDatepickerDirectiveModel, DynamicDragDropFileZoneModel, DynamicCheckboxModel, DynamicTextAreaModel } from '@core/custom';
import { GlobalDocumentFormComponent } from './global-document-form.component';
import { DocumentFormSettings } from '../document-form/document-form.interface';
import { DocumentPageService } from '../services/document-page.service';
import { SuggestionSettings } from '../document-form-extension';

@Component({
  selector: 'backslash-asset-video-form',
  template: '<document-form [user]="currentUser" [document]="document" [settings]="formSettings" [beforeSave]="beforeSave" [afterSave]="afterSave" (callback)="onCallback($event)"></document-form>',
})
export class BackslashAssetVideoFormComponent extends GlobalDocumentFormComponent {

  static readonly NAME: string = 'backslash-video-form';

  protected documentType: string = 'App-Backslash-Video';

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
        required: false,
        hidden: true,
        formMode: 'create',
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
        id: 'dc:title',
        label: 'Title',
        maxLength: 150,
        placeholder: 'Title',
        autoComplete: 'off',
        required: true,
        formMode: 'edit',
        validators: {
          required: null,
          minLength: 4,
        },
        errorMessages: {
          required: '{{label}} is required',
          minLength: 'At least 4 characters',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:assettype',
        label: 'know\\edge',
        required: false,
        settings: {
          multiple: false,
          placeholder: 'Select know\\edge',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Edges-Asset-Type',
        },
        defaultValue: '\\backslash',
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:backslash_type',
        label: 'Type',
        required: true,
        settings: {
          multiple: false,
          placeholder: 'Select Type',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Backslash-Type',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
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
        label: 'Production Date',
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
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:backslash_category',
        label: 'Category',
        required: true,
        settings: {
          placeholder: 'Select Category',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Backslash-Categories',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:Tags_edges',
        label: 'Edges',
        required: false,
        settings: {
          placeholder: 'Select Edges',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Edges-Edges',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:industry',
        label: 'Industry',
        required: false,
        settings: {
          placeholder: 'Select Industry',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Industries',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:agency',
        label: 'Agency',
        required: false,
        settings: {
          multiple: false,
          placeholder: 'Select Agency',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Agencies',
        },
      }),
      new DynamicInputModel({
        id: 'app_Edges:Spotter',
        label: 'Spotter(s)',
        placeholder: 'Spotter(s)',
        required: false,
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:country',
        label: 'Spotter Country',
        required: false,
        settings: {
          placeholder: 'Select Spotter Country',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Countries',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:Relevant_Country',
        label: 'Relevant Country',
        required: false,
        settings: {
          placeholder: 'Select Relevant Country',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Geography_TBWA',
        },
      }),
      new DynamicInputModel({
        id: 'app_Edges:URL',
        label: 'Public URL',
        placeholder: 'Public URL',
        required: false,
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:brand',
        label: 'Brand',
        required: false,
        placeholder: 'Brand',
      }),
      new DynamicCheckboxModel({
        id: 'app_Edges:active_article',
        label: 'Active Article',
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'file:content',
        formMode: 'create',
        layoutPosition: 'right',
        settings: {
          queueLimit: 25,
          placeholder: 'Drop Video File here!',
          acceptTypes: '.mp4',
        },
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'file:content',
        formMode: 'edit',
        layoutPosition: 'right',
        settings: {
          queueLimit: 1,
          placeholder: 'Drop Video File here!',
          acceptTypes: '.mp4',
        },
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'files:files',
        formMode: 'edit',
        layoutPosition: 'right',
        settings: {
          queueLimit: 20,
          placeholder: 'Drop to upload attachment',
          acceptTypes: 'image/*,.pdf,.key,.ppt,.zip,.doc,.xls,.mp4',
        },
      }),
      new DynamicBatchUploadModel<string>({
        id: 'batchUpload',
        layoutPosition: 'bottom',
        formMode: 'create',
        settings: {
          enableForm: true,
          enableAction: true,
        },
      }),
      new DynamicBatchUploadModel<string>({
        id: 'batchUpload',
        layoutPosition: 'bottom',
        formMode: 'edit',
        settings: {
          enableForm: false,
          enableAction: true,
        },
      }),
    ];
  }
}
