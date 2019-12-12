import { Component } from '@angular/core';
import { DocumentModel } from '@core/api';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel, DynamicOptionTagModel, DynamicCheckboxModel, DynamicDragDropFileZoneModel, DynamicDatepickerDirectiveModel } from '@core/custom';
import { AbstractCreativeForm } from '@pages/shared/abstract-classes/abstract-creative-form.component';

@Component({
  selector: 'creative-form-audio',
  templateUrl: './creative-form-audio.component.html',
})
export class CreativeFormAudioComponent extends AbstractCreativeForm {
  protected parentType: string = AbstractCreativeForm.AUDIO_ASSET;

  protected getSettings(): any[] {
    return [
      new DynamicInputModel({
        id: 'dc:title',
        label: 'Title',
        maxLength: 50,
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
        id: 'The_Loupe_Main:jobtitle',
        label: 'Search Project',
        placeholder: 'Search Project',
        required: true,
        validators: {
          required: null,
        },
        errorMessages: {
          required: '{{label}} is required',
        },
        hiddenFn: (doc: DocumentModel): boolean => doc.get('app_global:campaign_mgt'),
      }),
      new DynamicDatepickerDirectiveModel<string>({
        id: 'The_Loupe_ProdCredits:production_date',
        label: 'Production Date',
        readonly: true,
        default: (new Date()),
        required: true,
        validators: {
          required: null,
        },
        errorMessages: {
          required: '{{label}} is required',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:assettype',
        label: 'Asset Type',
        multiple: false,
        placeholder: 'What is this asset?',
        required: true,
        validators: {
          required: null,
        },
        errorMessages: {
          required: '{{label}} is required',
        },
        hiddenFn: (doc: DocumentModel): boolean => (doc.type === 'App-Library-Image'),
      }),
      new DynamicDatepickerDirectiveModel<string>({
        id: 'The_Loupe_Rights:first-airing',
        label: 'Live date / publishing',
        readonly: true,
        required: true,
        validators: {
          required: null,
        },
        errorMessages: {
          required: '{{label}} is required',
        },
        hiddenFn: (doc: DocumentModel): boolean => doc.get('app_global:UsageRights'),
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Rights:contract_mediatypes',
        label: 'Media Usage Types',
        placeholder: 'where is this used?',
        required: true,
        validators: {
          required: null,
        },
        errorMessages: {
          required: '{{label}} is required',
        },
        hiddenFn: (doc: DocumentModel): boolean => doc.get('app_global:UsageRights'),
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Rights:asset_countries',
        label: 'Asset Country',
        directoryName: 'GLOBAL_Countries',
        placeholder: 'leave blank to copy from agency\\brand',
        hiddenFn: (doc: DocumentModel): boolean => doc.get('app_global:UsageRights'),
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:region',
        label: 'Region',
        placeholder: 'Regions this assets was produced for..',
        hiddenFn: (doc: DocumentModel): boolean => doc.get('app_global_fields:enable_region'),
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Main:spotLength',
        label: 'Spot Length',
        maxLength: 50,
        hiddenFn: (doc: DocumentModel): boolean => (doc.type !== 'App-Library-Video'),
      }),
      new DynamicInputModel({
        id: 'dc:description',
        label: 'Description',
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Main:jobnumber',
        label: 'Job Number',
        hiddenFn: (doc: DocumentModel): boolean => !doc.get('app_global:campaign_mgt'),
      }),
      new DynamicOptionTagModel<string>({
        id: 'The_Loupe_Main:po_number_internal',
        label: 'PO Internal',
        hiddenFn: (doc: DocumentModel): boolean => !doc.get('app_global_fields:enable_po_number_internal'),
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Main:campaign',
        label: 'Project / Campaign',
        hiddenFn: (doc: DocumentModel): boolean => !doc.get('app_global:campaign_mgt'),
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Product_Info:productYear2',
        label: 'Product Year',
        hiddenFn: (doc: DocumentModel): boolean => doc.get('app_global_fields:enable_productyear'),
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:productModel',
        label: 'Products',
        hiddenFn: (doc: DocumentModel): boolean => !doc.get('app_global_fields:enable_productlist'),
      }),
      new DynamicCheckboxModel({
        id: 'app_global:networkshare',
        label: 'Share with TBWA\\Collective',
        hiddenFn: (doc: DocumentModel): boolean => doc.get('app_global:networkshare'),
      }),
      new DynamicSuggestionModel<string>({
        id: 'collectionMember:collectionIds',
        label: 'Collections',
        hiddenFn: (doc: DocumentModel): boolean => !doc.get('app_global:collections'),
      }),
      new DynamicBatchUploadModel<string>({
        id: 'files:files',
        layoutPosition: 'bottom',
        showInputs: false,
        multiUpload: true,
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAssetZone',
        uploadType: 'asset',
        layoutPosition: 'right',
        queueLimit: 1,
        placeholder: 'Drop Audio File here!',
        acceptTypes: '.mp3,.mp4,.wav',
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAttachmentZone',
        uploadType: 'attachment',
        layoutPosition: 'right',
        queueLimit: 20,
        placeholder: 'Drop to upload attachment',
        acceptTypes: 'image/*,.pdf,.key,.ppt,.zip,.doc,.xls,.mp4',
      }),
    ];
  }

  protected getFormLayout(): any {
    return {
      'dc:title': {
        element: {
          container: 'p-0',
          label: 'col-form-label',
        },
        grid: {
          host: 'col-sm-4',
        },
      },
      'The_Loupe_Main:brand': {
        element: {
          container: 'p-0',
          label: 'col-form-label',
        },
        grid: {
          host: 'col-sm-4',
        },
      },
      'app_Edges:industry': {
        element: {
          container: 'p-0',
          label: 'col-form-label',
        },
        grid: {
          host: 'col-sm-4',
        },
      },
      'The_Loupe_Main:description': {
        element: {
          container: 'p-0',
          label: 'col-form-label',
        },
        grid: {
          host: 'col-sm-4',
        },
      },
      'The_Loupe_Main:agency': {
        element: {
          container: 'p-0',
          label: 'col-form-label',
        },
        grid: {
          host: 'col-sm-4',
        },
      },
      'The_Loupe_Main:country': {
        element: {
          container: 'p-0',
          label: 'col-form-label',
        },
        grid: {
          host: 'col-sm-4',
        },
      },
    };
  }
}
