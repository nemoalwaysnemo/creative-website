import { Component } from '@angular/core';
import { DocumentModel, NuxeoAutomations, NuxeoUploadResponse, UserModel } from '@core/api';
import { DynamicSuggestionModel, DynamicInputModel } from '@core/custom';
import { GlobalDocumentFormComponent } from './global-document-form.component';
import { DocumentFormContext, DocumentFormSettings } from '../document-form/document-form.interface';
import { DocumentPageService } from '../services/document-page.service';
import { SuggestionSettings } from '../document-form-extension';
import { of as observableOf, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'creative-ring-collection-upload-form',
  template: `<document-batch-operation [documentModel]="document" [settings]="formSettings" [beforeSaveValidation]="beforeSaveValidation" [beforeSave]="beforeSave" [afterSave]="afterSave" [afterFormSave]="afterFormSave" (callback)="onCallback($event)"></document-batch-operation>`,
})
export class CreativeRingCollectionUploadFormComponent extends GlobalDocumentFormComponent {

  static readonly NAME: string = 'creative-ring-collection-upload-form';

  protected documentType: string = 'App-Library-CreativeRing-Collection';

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  afterFormSave: (ctx: DocumentFormContext) => Observable<DocumentFormContext> = (ctx: DocumentFormContext) => {
    const collection = ctx.performedDocuments[0];
    const assetIds = ctx.formValue['selected-documents'] ? ctx.formValue['selected-documents'] : ctx.performedDocuments.slice(1).map((d: DocumentModel) => d.uid);
    if (assetIds.length > 0) {
      return this.documentPageService.operation(NuxeoAutomations.AddToCollection, { collection: collection.uid }, assetIds).pipe(
        map(_ => ctx),
      );
    } else {
      return observableOf(ctx);
    }
  }

  protected beforeOnCreation(doc: DocumentModel, user: UserModel, formSettings: DocumentFormSettings): Observable<DocumentModel> {
    return observableOf(doc);
  }

  protected getDocumentFormSettings(options: any = {}): DocumentFormSettings {
    let agencyName = null;
    let brandName = null;
    if (options.collectionType === 'Agency Collection') {
      agencyName = options.collectionName;
    } else if (options.collectionType === 'Brand Collection') {
      brandName = options.collectionName;
    }

    return new DocumentFormSettings({
      acceptTypes: 'image/*,.pdf,.mp3,.mp4,.mov,.m4a,.3gp,.3g2,.mj2',
      enableBulkImport: options.formType === 'new',
      docType: this.documentType,
      enableCreateMain: true,
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
      sharedModel: [
        new DynamicSuggestionModel<string>({
          id: 'The_Loupe_Main:brand',
          label: 'Brand',
          layoutPosition: 'leftNarrow',
          required: true,
          settings: {
            placeholder: 'What is this brand?',
            providerType: SuggestionSettings.DIRECTORY,
            providerName: 'App-Library-CreativeRing-Brands',
            layout: 'direction-horizontal',
            selectedItems: [brandName],
          },
          validators: { required: null },
          errorMessages: { required: '' },
        }),
        new DynamicSuggestionModel<string>({
          id: 'The_Loupe_Main:agency',
          label: 'Agency',
          layoutPosition: 'leftNarrow',
          required: true,
          settings: {
            multiple: false,
            placeholder: 'What is this agency?',
            providerType: SuggestionSettings.DIRECTORY,
            providerName: 'GLOBAL_Agencies',
            selectedItems: [agencyName],
          },
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
            layout: 'direction-horizontal',
          },
          validators: {
            required: null,
            minLength: 4,
          },
          errorMessages: {
            required: '{{label}} is required',
            minLength: 'At least 4 characters',
          },
          visibleFn: (): boolean => options.formType === 'new',
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
            layout: 'direction-horizontal',
          },
          validators: { required: null },
          errorMessages: { required: '' },
        }),
      ],
    });
  }

}
