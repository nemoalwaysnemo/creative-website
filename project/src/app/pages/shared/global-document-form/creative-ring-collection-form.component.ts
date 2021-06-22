import { Component } from '@angular/core';
import { UserModel, DocumentModel, NuxeoUploadResponse, GlobalSearchParams, NuxeoPagination } from '@core/api';
import { of as observableOf, Observable } from 'rxjs';
import { DynamicSuggestionModel, DynamicInputModel } from '@core/custom';
import { SuggestionSettings } from '../document-form-extension';
import { GlobalDocumentFormComponent } from './global-document-form.component';
import { DocumentFormContext, DocumentFormEvent, DocumentFormSettings } from '../document-form/document-form.interface';
import { DocumentPageService } from '../services/document-page.service';
import { NUXEO_DOC_TYPE, NUXEO_PATH_INFO } from '@environment/environment';
import { map, tap } from 'rxjs/operators';
import { escapeValue } from '@core/services/helpers';

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

  protected beforeOnCallback(event: DocumentFormEvent): Observable<DocumentFormEvent> {
    console.log(33333, event);
    if (event.action === 'onBlur' && event.model && event.model.id === 'dc:title') {
      return this.checkCollectionName(event.formValue['dc:title']).pipe(
        tap((d: DocumentModel) => {
          console.log(44444, d);
        }),
        map((d: DocumentModel) => event),
      );
    }
    return observableOf(event);
  }

  private checkCollectionName(title: string): Observable<DocumentModel> {
    const params: any = {
      currentPageIndex: 0,
      pageSize: 1,
      title_eq: escapeValue(title),
      ecm_path: NUXEO_PATH_INFO.CREATIVE_BASE_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_RING_COLLECTION_TYPE,
    };
    return this.documentPageService.advanceRequest(new GlobalSearchParams(params)).pipe(map((res: NuxeoPagination) => res.entries.shift()));
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
          errorMessages: {
            required: '{{label}} is required',
            minLength: 'At least 4 characters',
          },
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
          validators: { required: null },
          errorMessages: { required: '' },
        }),
        new DynamicSuggestionModel<string>({
          id: 'The_Loupe_Main:agency',
          label: 'Agency',
          required: true,
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
          },
          validators: { required: null },
          errorMessages: { required: '' },
        }),
      ],
    });
  }

}
