import { Component } from '@angular/core';
import { DocumentModel } from '@core/api';
import { Observable } from 'rxjs';
import {
  DynamicBatchUploadModel,
  DynamicInputModel,
  DynamicDragDropFileZoneModel,
  DynamicTextAreaModel,
  DynamicSuggestionModel,
  DynamicDatepickerDirectiveModel,
  DynamicOptionTagModel,
  DynamicCheckboxModel,
  DynamicCheckboxGroupModel,
  DynamicRadioGroupModel,
} from '@core/custom';
import { GlobalDocumentFormComponent } from './global-document-form.component';
import { SuggestionSettings } from '../directory-suggestion/directory-suggestion-settings';
import { DocumentPageService } from '../services/document-page.service';

@Component({
  selector: 'intelligence-asset-form',
  template: `<document-form [document]="document" [formMode]="formMode" [settings]="settings" [beforeSave]="beforeSave" (callback)="onCallback($event)"></document-form>`,
})
export class IntelligenceAssetFormComponent extends GlobalDocumentFormComponent {

  beforeSave: Function = (doc: DocumentModel): DocumentModel => {
    doc.properties['nxtag:tags'] = doc.properties['nxtag:tags'].map((tag: string) => {
      return { 'label': tag, username: this.currentUser.username };
    });
    return doc;
  }

  protected documentType: string = 'App-Intelligence-Asset';

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  protected beforeOnCreation(doc: DocumentModel): Observable<DocumentModel> {
    return this.initializeDocument(doc, this.getDocType());
  }

  protected getSettings(): object[] {
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
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:assettype',
        label: 'know\\egde',
        settings: {
          multiple: false,
          placeholder: 'Select a value',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Edges-Asset-Type',
        },
      }),
      // new DynamicRadioGroupModel<string>({
      //   id: 'The_Loupe_Main:assettype',
      //   label: 'know\\egde',
      //   options: [
      //     {
      //       label: '\\backslash',
      //       value: '\\backslash',
      //     },
      //     {
      //       label: 'Disruption',
      //       value: 'Disruption',
      //     },
      //     {
      //       label: 'Intelligence',
      //       value: 'Intelligence',
      //     },
      //     {
      //       label: 'Trigger',
      //       value: 'Trigger',
      //     },
      //   ],
      // }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:intelligence_category',
        label: 'Intelligence Category ',
        required: true,
        settings: {
          placeholder: 'Select a value',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Intelligence-Category',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      // new DynamicCheckboxGroupModel({
      //   id: 'app_Edges:intelligence_category',
      //   label: 'Intelligence Category ',
      //   group: [
      //     new DynamicCheckboxModel({
      //       id: 'Brands',
      //       label: 'Brands',
      //     }),
      //     new DynamicCheckboxModel({
      //       id: 'Consumer',
      //       label: 'Consumer',
      //     }),
      //     new DynamicCheckboxModel({
      //       id: 'Industry',
      //       label: 'Industry',
      //     }),
      //     new DynamicCheckboxModel({
      //       id: 'Marketing',
      //       label: 'Marketing',
      //     }),
      //   ],
      // }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:intelligence_type',
        label: 'Intelligence Type',
        required: true,
        settings: {
          multiple: false,
          placeholder: 'Select a value',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Intelligence-Type',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      // new DynamicRadioGroupModel<string>({
      //   id: 'app_Edges:intelligence_type',
      //   label: 'Intelligence Type',
      //   required: true,
      //   options: [
      //     {
      //       label: '3rd Party Report',
      //       value: '3rd Party Report',
      //     },
      //     {
      //       label: 'Exploration',
      //       value: 'Exploration',
      //     },
      //     {
      //       label: 'Infographic',
      //       value: 'Infographic',
      //     },
      //     {
      //       label: 'Intelligence Update	',
      //       value: 'Intelligence Update	',
      //     },
      //     {
      //       label: 'Newsletter',
      //       value: 'Newsletter',
      //     },
      //     {
      //       label: 'Rapid Immersion',
      //       value: 'Rapid Immersion',
      //     },
      //     {
      //       label: 'Thought Piece',
      //       value: 'Thought Piece',
      //     },
      //   ],
      // }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:internal_external',
        label: 'internal/external',
        required: true,
        settings: {
          multiple: false,
          placeholder: 'Select a value',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_internal-external',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      // new DynamicRadioGroupModel<string>({
      //   id: 'app_Edges:internal_external',
      //   label: 'internal/external',
      //   required: true,
      //   options: [
      //     {
      //       label: 'external',
      //       value: 'external',
      //     },
      //     {
      //       label: 'internal',
      //       value: 'internal',
      //     },
      //   ],
      // }),
      new DynamicTextAreaModel({
        id: 'dc:description',
        label: 'Description',
        rows: 3,
        required: true,
      }),
      new DynamicSuggestionModel<string>({
        id: 'nxtag:tags',
        label: 'Tag',
        settings: {
          addTag: (name: string) => ({ label: name, value: name }),
          placeholder: 'Select/Add a tag',
          providerType: SuggestionSettings.TAG,
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:Relevant_Country',
        label: 'Geography',
        required: true,
        settings: {
          placeholder: 'Select a value',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Geography_TBWA',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicDatepickerDirectiveModel<string>({
        id: 'The_Loupe_ProdCredits:production_date',
        label: 'Published',
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
        required: true,
        placeholder: 'Author',
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:industry',
        label: 'Industry',
        required: true,
        settings: {
          placeholder: 'Select a value',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Industries',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:agency',
        label: 'Agency',
        settings: {
          multiple: false,
          placeholder: 'Please select agency',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Agencies',
        },
      }),
      new DynamicInputModel({
        id: 'app_Edges:project_name',
        label: 'Project Name',
        maxLength: 50,
        placeholder: 'Project Name',
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:clientName',
        label: 'Client',
        required: false,
        placeholder: 'Client',
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:brand',
        label: 'Brand',
        required: false,
        placeholder: 'Brand',
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:backslash_category',
        label: 'Edge Category',
        required: false,
        settings: {
          placeholder: 'Select a value',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Backslash-Categories',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:Tags_edges',
        label: 'Edges',
        required: false,
        settings: {
          placeholder: 'Select a value',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Edges-Edges',
        },
      }),
      new DynamicCheckboxModel({
        id: 'app_Edges:client_accessible',
        label: 'Client Accessible ',
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAssetZone',
        formMode: 'create',
        uploadType: 'asset',
        layoutPosition: 'right',
        queueLimit: 25,
        placeholder: 'Drop Image/PDF/Video File(s) here!',
        acceptTypes: 'image/*,.pdf,.mp4',
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
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAttachmentZone',
        formMode: 'edit',
        uploadType: 'attachment',
        layoutPosition: 'right',
        queueLimit: 1,
        placeholder: 'Drop to upload attachment',
        acceptTypes: 'image/*,.pdf,.key,.ppt,.zip,.doc,.xls,.mp4',
      }),
      new DynamicBatchUploadModel<string>({
        id: 'files:files',
        layoutPosition: 'bottom',
        formMode: 'create',
        multiUpload: true,
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
