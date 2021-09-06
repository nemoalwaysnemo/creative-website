import { Component } from '@angular/core';
import { DocumentModel, NuxeoAutomations, NuxeoUploadResponse, UserModel } from '@core/api';
import { DynamicSuggestionModel, DynamicInputModel } from '@core/custom';
import { GlobalDocumentFormComponent } from './global-document-form.component';
import { DocumentFormContext, DocumentFormEvent, DocumentFormSettings } from '../document-form/document-form.interface';
import { DocumentPageService } from '../services/document-page.service';
import { SuggestionSettings } from '../document-form-extension';
import { of as observableOf, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isValueEmpty } from '@core/services/helpers';

@Component({
  selector: 'creative-ring-collection-upload-form',
  templateUrl: './creative-ring-collection-upload-form.component.html',
  styleUrls: ['./global-document-form.component.scss'],
})
export class CreativeRingCollectionUploadFormComponent extends GlobalDocumentFormComponent {

  static readonly NAME: string = 'creative-ring-collection-upload-form';

  protected documentType: string = 'App-Library-CreativeRing-Collection';

  enableUpload: boolean = false;

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  afterFormSave: (ctx: DocumentFormContext) => Observable<DocumentFormContext> = (ctx: DocumentFormContext) => {
    const collection = this.document;
    const assetIds = (ctx.performedDocuments || []).map((d: DocumentModel) => d.uid);
    if (assetIds.length > 0) {
      return this.documentPageService.operation(NuxeoAutomations.AddToCollection, { collection: collection.uid }, assetIds).pipe(
        map(_ => ctx),
      );
    } else {
      return observableOf(ctx);
    }
  };

  protected beforeOnCreation(doc: DocumentModel, user: UserModel, formSettings: DocumentFormSettings): Observable<DocumentModel> {
    return observableOf(doc);
  }

  protected beforeOnCallback(event: DocumentFormEvent): Observable<DocumentFormEvent> {
    if (!this.enableUpload && event.action === 'SharedValueChanged' && this.sharedModelValid(event.formValue)) {
      this.enableUpload = true;
    }
    return observableOf(event);
  }

  protected getDocumentFormSettings(options: any = {}): DocumentFormSettings {
    let agencyName = null, brandName = null;
    if (options.collectionType === 'Agency Collection') {
      agencyName = options.collectionName;
    } else if (options.collectionType === 'Brand Collection') {
      brandName = options.collectionName;
    }

    return new DocumentFormSettings({
      acceptTypes: 'image/*,.pdf,.mp3,.mp4,.mov,.m4a,.3gp,.3g2,.mj2',
      enableBulkImport: true,
      docType: this.documentType,
      enableCreateMain: true,
      importSettings: {
        placeholder: 'Upload Assets',
        batchUploadLayout: 'common-table uploadAsset',
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
        new DynamicInputModel({
          id: 'The_Loupe_Main:brand',
          label: 'Brand',
          hidden: true,
          defaultValue: [brandName],
          visibleFn: (ctx: DocumentFormContext): boolean => brandName,
        }),
        new DynamicSuggestionModel<string>({
          id: 'The_Loupe_Main:brand',
          label: 'Brand',
          required: true,
          settings: {
            placeholder: 'What is this brand?',
            providerType: SuggestionSettings.DIRECTORY,
            providerName: 'App-Library-CreativeRing-Brands',
            layout: 'direction-horizontal',
          },
          validators: { required: null },
          errorMessages: { required: '{{label}} is required' },
          visibleFn: (ctx: DocumentFormContext): boolean => !brandName,
        }),
        new DynamicInputModel({
          id: 'The_Loupe_Main:agency',
          label: 'Agency',
          hidden: true,
          defaultValue: agencyName,
          visibleFn: (ctx: DocumentFormContext): boolean => agencyName,
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
          validators: { required: null },
          errorMessages: { required: '{{label}} is required' },
          visibleFn: (ctx: DocumentFormContext): boolean => !agencyName,
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

  private sharedModelValid(formValue): boolean {
    let requiredAllFilled = true;
    Object.entries(formValue).forEach(([key, value]) => {
      const valid = Object.values(this.getDocumentFormSettings().sharedModel).find((obj) => {
        return obj.name === key && obj.required === true && isValueEmpty(value);
      });
      if (!!valid) {
        requiredAllFilled = false;
      }
    },
    );
    return requiredAllFilled;
  }
}
