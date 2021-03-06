import { Component } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { Observable } from 'rxjs';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel, DynamicOptionTagModel, DynamicDragDropFileZoneModel, DynamicTextAreaModel } from '@core/custom';
import { GlobalDocumentFormComponent } from './global-document-form.component';
import { DocumentFormSettings } from '../document-form/document-form.interface';
import { DocumentPageService } from '../services/document-page.service';
import { SuggestionSettings } from '../document-form-extension';

@Component({
  selector: 'backslash-trigger-form',
  template: '<document-form [user]="currentUser" [document]="document" [settings]="formSettings" [beforeSave]="beforeSave" [afterSave]="afterSave" (callback)="onCallback($event)"></document-form>',
})
export class BackslashTriggerFormComponent extends GlobalDocumentFormComponent {

  static readonly NAME: string = 'backslash-trigger-form';

  protected documentType: string = 'App-Edges-Trigger';

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  protected beforeOnCreation(doc: DocumentModel, user: UserModel, formSettings: DocumentFormSettings): Observable<DocumentModel> {
    return this.initializeDocument(doc, this.getDocType());
  }

  protected getFormModels(): any[] {
    return [
      new DynamicOptionTagModel({
        id: 'app_Edges:spotter_handle',
        label: 'Spotter Handle',
        placeholder: 'Spotter Handle',
        required: true,
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:country',
        label: 'Spotter Country',
        required: true,
        settings: {
          placeholder: 'Please select country',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Countries',
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
      }),
      new DynamicInputModel({
        id: 'dc:title',
        label: 'Headline',
        maxLength: 50,
        placeholder: 'Headline',
        autoComplete: 'off',
        required: true,
        errorMessages: {
          required: '{{label}} is required',
          minLength: 'At least 4 characters',
        },
      }),
      new DynamicSuggestionModel({
        id: 'app_Edges:format',
        label: 'Format',
        required: true,
        settings: {
          placeholder: 'Please select format',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Backslash-Type',
        },
      }),
      new DynamicSuggestionModel({
        id: 'app_Edges:Relevant_Country',
        label: 'Relevant Country',
        required: true,
        settings: {
          placeholder: 'Please select country',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Geography_TBWA',
        },
      }),
      new DynamicTextAreaModel({
        id: 'app_Edges:trigger_text',
        label: 'Trigger Summary',
        rows: 5,
        required: true,
      }),
      new DynamicSuggestionModel({
        id: 'app_Edges:Tags_edges',
        label: 'Edges',
        required: true,
        settings: {
          placeholder: 'Please select edges',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Edges-Edges',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:backslash_category',
        label: 'Category',
        required: true,
        settings: {
          placeholder: 'Please select category',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Backslash-Categories',
        },
      }),
      new DynamicTextAreaModel({
        id: 'app_Edges:insight',
        label: 'Key Insight',
        rows: 5,
        required: true,
      }),
      new DynamicTextAreaModel({
        id: 'app_Edges:URL',
        label: 'Web Links',
        rows: 5,
        required: true,
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:brand',
        label: 'Brand',
        placeholder: 'Brand',
        required: false,
      }),
      new DynamicSuggestionModel<string>({
        id: 'collectionMember:collectionIds',
        label: 'Add to Stories',
        required: false,
        settings: {
          displayLabel: true,
          placeholder: 'Select/Add',
          providerType: SuggestionSettings.PROVIDER,
          providerName: 'App-Edges-PageProvider-Collections',
        },
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'file:content',
        layoutPosition: 'right',
        settings: {
          queueLimit: 1,
          xpath: 'file:content',
          placeholder: 'Drop Image File(s) here!',
          acceptTypes: 'image/*',
        },
      }),
      new DynamicBatchUploadModel<string>({
        id: 'batchUpload',
        layoutPosition: 'bottom',
        settings: {
          enableForm: false,
          enableAction: false,
        },
      }),
    ];
  }
}
