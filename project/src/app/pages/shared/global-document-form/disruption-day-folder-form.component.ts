import { Component } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel, DynamicOptionTagModel, DynamicDatepickerDirectiveModel, DynamicDragDropFileZoneModel } from '@core/custom';
import { DocumentFormEvent, DocumentFormSettings } from '../document-form/document-form.interface';
import { GlobalDocumentFormComponent } from './global-document-form.component';
import { DocumentPageService } from '../services/document-page.service';
import { SuggestionSettings } from '../document-form-extension';

@Component({
  selector: 'disruption-day-folder-form',
  template: '<document-form [user]="currentUser" [document]="document" [settings]="formSettings" [beforeSave]="beforeSave" [afterSave]="afterSave" (callback)="onCallback($event)"></document-form>',
})
export class DisruptionDayFolderFormComponent extends GlobalDocumentFormComponent {

  static readonly NAME: string = 'disruption-day-folder-form';

  protected documentType: string = 'App-Disruption-Day';

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  protected beforeOnCreation(doc: DocumentModel, user: UserModel, formSettings: DocumentFormSettings): Observable<DocumentModel> {
    return this.initializeDocument(doc, this.getDocType());
  }

  protected beforeOnCallback(event: DocumentFormEvent): Observable<DocumentFormEvent> {
    if (event.action === 'Created') {
      event.redirectUrl = '/p/disruption/Disruption Days/day/:uid';
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
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:brand',
        label: 'Brand',
        placeholder: 'Brand',
        required: true,
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:industry',
        label: 'Industry',
        required: true,
        settings: {
          placeholder: 'Please select industry',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Industries',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicDatepickerDirectiveModel<string>({
        id: 'The_Loupe_ProdCredits:production_date',
        label: 'Workshop Date',
        placeholder: 'Workshop Date',
        readonly: false,
        required: true,
        defaultValue: (new Date()),
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
        id: 'app_Edges:Relevant_Country',
        label: 'Geography',
        required: true,
        settings: {
          placeholder: 'Please select country',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Geography_TBWA',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:agency',
        label: 'Agency',
        required: true,
        settings: {
          multiple: false,
          placeholder: 'Please select agency',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Agencies',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:country',
        label: 'Agency Country',
        required: true,
        settings: {
          placeholder: 'Please select country',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Countries',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:backslash_category',
        label: 'Backslash Category',
        required: true,
        settings: {
          placeholder: 'Please select category',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Backslash-Categories',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:Tags_edges',
        label: 'Edges',
        required: true,
        settings: {
          placeholder: 'Please select edges',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Edges-Edges',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Main:description',
        label: 'Description',
        formMode: 'edit',
        placeholder: 'description',
        required: true,
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicInputModel({
        id: 'dc:creator',
        label: 'Author',
        formMode: 'edit',
        placeholder: 'Author',
        required: true,
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Main:assettype',
        label: 'Asset Type',
        required: false,
        hidden: true,
        defaultValue: 'Disruption Day',
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'file:content',
        formMode: 'create',
        layoutPosition: 'right',
        settings: {
          queueLimit: 1,
          placeholder: 'Drop Folder Image here! This will become the thumbnail for the new folder.',
          acceptTypes: 'image/*,.pdf',
        },
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'file:content',
        formMode: 'edit',
        layoutPosition: 'right',
        settings: {
          queueLimit: 1,
          placeholder: 'Drop Logo/Image here!',
          acceptTypes: 'image/*,.pdf',
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
          enableForm: false,
          enableAction: false,
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
