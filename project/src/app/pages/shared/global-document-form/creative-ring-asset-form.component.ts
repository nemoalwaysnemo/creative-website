import { Component } from '@angular/core';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel, DynamicOptionTagModel, DynamicDatepickerDirectiveModel, DynamicDragDropFileZoneModel } from '@core/custom';
import { SuggestionSettings } from '../document-form-extension';
import { GlobalDocumentFormComponent } from './global-document-form.component';
import { DocumentPageService } from '../services/document-page.service';
import { OptionModel } from '../option-select/option-select.interface';

@Component({
  selector: 'creative-ring-asset-form',
  template: `<document-form [user]="currentUser" [document]="document" [settings]="formSettings" [beforeSave]="beforeSave" [afterSave]="afterSave" (callback)="onCallback($event)"></document-form>`,
})
export class CreativeRingAssetFormComponent extends GlobalDocumentFormComponent {

  static readonly NAME: string = 'creative-ring-asset-form';

  static readonly COMPONENT_TYPE: string = 'form';

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  protected getFormSettings(): any {
    return {
      showUploadMessage: true,
    };
  }

  protected getFormModels(): any[] {
    return [
      new DynamicInputModel({
        id: 'dc:title',
        label: 'Title',
        maxLength: 150,
        placeholder: 'Title',
        autoComplete: 'off',
        validators: {
          required: null,
          minLength: 4,
        },
        errorMessages: {
          required: '{{label}} is required',
          minLength: 'At least 4 characters',
        },
      }),
      new DynamicDatepickerDirectiveModel<string>({
        id: 'The_Loupe_ProdCredits:production_date',
        label: 'Production Date',
        readonly: false,
        defaultValue: (new Date()),
        validators: {
          required: null,
          dateFormatValidator: null,
        },
        errorMessages: {
          required: '{{label}} is required',
          dateFormatValidator: 'Invalid format. Valid Format MMM D, YYYY',
        },
      }),
      // #{changeableDocument.type === 'App-Library-Audio' ? 'edit' : 'hidden'}
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
        onResponse: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:brand',
        label: 'Brand',
        required: false,
        placeholder: 'Brand',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Rights:asset_countries',
        label: 'Asset Country',
        settings: {
          placeholder: 'Asset Country',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Countries',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:agency',
        label: 'Agency',
        // required: true,
        settings: {
          multiple: false,
          placeholder: 'What is this agency?',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Agencies',
        },
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'file:content',
        layoutPosition: 'right',
        settings: {
          queueLimit: 1,
          placeholder: 'Replace Main file!',
          acceptTypes: '.mp4,.mov,.m4a,.3gp,.3g2,.mj2',
        },
        visibleFn: (): boolean => this.document.type === 'App-Library-Video',
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'file:content',
        layoutPosition: 'right',
        settings: {
          queueLimit: 1,
          placeholder: 'Replace Main file!',
          acceptTypes: 'image/*,.pdf',
        },
        visibleFn: (): boolean => this.document.type === 'App-Library-Image',
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'file:content',
        layoutPosition: 'right',
        settings: {
          queueLimit: 1,
          placeholder: 'Replace Main file!',
          acceptTypes: '.mp3,.mp4',
        },
        visibleFn: (): boolean => this.document.type === 'App-Library-Audio',
      }),
      new DynamicBatchUploadModel<string>({
        id: 'batchUpload',
        layoutPosition: 'bottom',
        settings: {
          enableForm: false,
          enableAction: true,
        },
      }),
    ];
  }
}
