import { Component } from '@angular/core';
import { DocumentModel, NuxeoUploadResponse, UserModel } from '@core/api';
import { DynamicSuggestionModel, DynamicInputModel, DynamicFormHook } from '@core/custom';
import { GlobalDocumentFormComponent } from './global-document-form.component';
import { DocumentFormSettings } from '../document-form/document-form.interface';
import { DocumentPageService } from '../services/document-page.service';
import { SuggestionSettings } from '../document-form-extension';
import { of as observableOf, Observable } from 'rxjs';
import { NUXEO_DOC_TYPE, NUXEO_PATH_INFO } from '@environment/environment';

@Component({
  selector: 'creative-ring-collection-form',
  template: `<document-batch-operation [documentModel]="document" [settings]="formSettings" [beforeSaveValidation]="beforeSaveValidation" [beforeSave]="beforeSave" [afterSave]="afterSave" (callback)="onCallback($event)"></document-batch-operation>`,
})
export class CreativeRingCollectionFormComponent extends GlobalDocumentFormComponent {

  static readonly NAME: string = 'creative-ring-collection-form';

  protected documentType: string = 'App-Library-CreativeRing-Collection';

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  protected beforeOnCreation(doc: DocumentModel, user: UserModel, formSettings: DocumentFormSettings): Observable<DocumentModel> {
    return observableOf(doc);
  }

  protected getDocumentFormSettings(): DocumentFormSettings {
    return new DocumentFormSettings({
      acceptTypes: 'image/*,.pdf,.mp3,.mp4,.mov,.m4a,.3gp,.3g2,.mj2',
      importSettings: {
        placeholder: 'Upload Assets',
        getDocType: (item: NuxeoUploadResponse): string => {
          if (['video'].some(x => item.mimeType.includes(x))) {
            return 'App-Library-Video';
          } else if (['image', 'pdf'].some(x => item.mimeType.includes(x))) {
            return 'App-Library-Image';
          } else if (['audio'].some(x => item.mimeType.includes(x))) {
            return 'App-Library-Audio';
          }
        },
      },
      formModel: [
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
          layoutPosition: 'leftNarrow',
          asyncValidators: {
            uniqueDocumentValidator: {
              documentPageService: this.documentPageService,
              searchParams: {
                ecm_path: NUXEO_PATH_INFO.CREATIVE_BASE_FOLDER_PATH,
                ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_RING_COLLECTION_TYPE,
              },
            },
          },
          errorMessages: {
            required: '{{label}} is required',
            minLength: 'At least 4 characters',
            uniqueDocumentValidator: 'The collection {{value}} already exists, please change one',
          },
          // updateOn: DynamicFormHook.Blur,
        }),
        new DynamicSuggestionModel<string>({
          id: 'The_Loupe_Main:assettype',
          label: 'Asset Type',
          required: true,
          settings: {
            multiple: false,
            placeholder: 'What is this asset?',
            providerType: SuggestionSettings.DIRECTORY,
            providerName: 'App-Library-MediaTypes-Mixed',
          },
          layoutPosition: 'leftNarrow',
          validators: { required: null },
          errorMessages: { required: '' },
        }),
        new DynamicSuggestionModel<string>({
          id: 'The_Loupe_Main:brand',
          label: 'Brand',
          required: true,
          settings: {
            multiple: false,
            placeholder: 'What is this brand?',
            providerType: SuggestionSettings.DIRECTORY,
            providerName: 'App-Library-CreativeRing-Brands',
          },
          layoutPosition: 'leftNarrow',
          validators: { required: null },
          errorMessages: { required: '' },
        }),
        new DynamicSuggestionModel<string>({
          id: 'The_Loupe_Main:agency',
          label: 'Agency',
          required: true,
          layoutPosition: 'leftNarrow',
          settings: {
            multiple: false,
            placeholder: 'What is this agency?',
            providerType: SuggestionSettings.DIRECTORY,
            providerName: 'GLOBAL_Agencies',
          },
        }),
        new DynamicInputModel({
          id: 'dc:description',
          label: 'Description',
          layoutPosition: 'leftNarrow',
        }),
      ],
      importModel: [
        new DynamicInputModel({
          id: 'dc:title',
          label: 'Title',
          maxLength: 150,
          placeholder: 'Title',
          autoComplete: 'off',
          required: true,
          settings: {
            direction: 'horizontal',
          },
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
          id: 'The_Loupe_Main:brand',
          label: 'Brand',
          required: true,
          settings: {
            multiple: false,
            placeholder: 'What is this brand?',
            providerType: SuggestionSettings.DIRECTORY,
            providerName: 'App-Library-CreativeRing-Brands',
            direction: 'horizontal',
          },
          validators: { required: null },
          errorMessages: { required: '' },
        }),
        new DynamicSuggestionModel<string>({
          id: 'The_Loupe_Main:assettype',
          label: 'Asset Type',
          required: true,
          settings: {
            multiple: false,
            placeholder: 'What is this asset?',
            providerType: SuggestionSettings.DIRECTORY,
            providerName: 'App-Library-MediaTypes-Mixed',
            direction: 'horizontal',
          },
          validators: { required: null },
          errorMessages: { required: '' },
        }),
      ],
    });
  }

}
