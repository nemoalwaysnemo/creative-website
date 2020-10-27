import { Component } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { Observable } from 'rxjs';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel, DynamicOptionTagModel, DynamicDatepickerDirectiveModel, DynamicDragDropFileZoneModel, DynamicCheckboxModel, DynamicTextAreaModel } from '@core/custom';
import { GlobalDocumentFormComponent } from './global-document-form.component';
import { SuggestionSettings } from '../directory-suggestion/directory-suggestion-settings';
import { DocumentFormSettings } from '../document-form/document-form.interface';
import { DocumentPageService } from '../services/document-page.service';

@Component({
  selector: 'disruption-roadmap-form',
  template: `<document-form [currentUser]="currentUser" [document]="document" [settings]="formSettings" [beforeSave]="beforeSave" [afterSave]="afterSave" (callback)="onCallback($event)"></document-form>`,
})
export class DisruptionRoadmapFormComponent extends GlobalDocumentFormComponent {

  static readonly NAME: string = 'disruption-roadmap-form';

  protected documentType: string = 'App-Disruption-Roadmap-Asset';

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
        settings: {
          placeholder: 'Please select edges',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Edges-Edges',
        },
      }),
      new DynamicInputModel({
        id: 'dc:description',
        label: 'Description',
        placeholder: 'Description',
        required: true,
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:created_by',
        label: 'Author',
        required: true,
        placeholder: 'Author',
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicCheckboxModel({
        id: 'app_Edges:featured_asset',
        label: 'Featured roadmap',
        visibleFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): boolean => user.isAdmin() || user.hasGroup('Disruption-Admins-Disruption'),
      }),
      new DynamicTextAreaModel({
        id: 'app_Edges:featured_asset_description',
        label: 'Featured Description',
        rows: 3,
        visibleFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): boolean => user.isAdmin() || user.hasGroup('Disruption-Admins-Disruption'),
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Main:assettype',
        label: 'Asset Type',
        required: false,
        hidden: true,
        defaultValue: 'Disruption Roadmap',
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAssetZone',
        formMode: 'create',
        uploadType: 'asset',
        layoutPosition: 'right',
        queueLimit: 25,
        placeholder: 'Drop PDF File(s) here!',
        acceptTypes: '.pdf',
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAssetZone',
        formMode: 'edit',
        uploadType: 'asset',
        layoutPosition: 'right',
        queueLimit: 1,
        placeholder: 'Drop PDF File(s) here!',
        acceptTypes: '.pdf',
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAttachmentZone',
        formMode: 'edit',
        uploadType: 'attachment',
        layoutPosition: 'right',
        queueLimit: 20,
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
        multiUpload: true,
      }),
    ];
  }
}
