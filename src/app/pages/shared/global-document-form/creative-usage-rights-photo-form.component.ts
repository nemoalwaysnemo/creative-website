import { Component } from '@angular/core';
import { NuxeoApiService, DocumentModel } from '@core/api';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel, DynamicOptionTagModel, DynamicDatepickerDirectiveModel, DynamicDragDropFileZoneModel, DynamicCheckboxModel, DynamicListModel } from '@core/custom';
import { AbstractDocumentFormComponent } from '../abstract-classes/abstract-document-form.component';
import { Observable } from 'rxjs';
import { OptionModel } from '../option-select/option-select.interface';
import { SuggestionSettings } from '../directory-suggestion/directory-suggestion-settings';

@Component({
  selector: 'creative-usage-rights-photo-form',
  template: `<document-form [document]="document" [settings]="settings" [layout]="formLayout" (callback)="callback($event)"></document-form>`,
})
export class CreativeUsageRightsPhotoComponent extends AbstractDocumentFormComponent {

  protected documentType: string = 'App-Library-UsageRights-Photographer';

  constructor(protected nuxeoApi: NuxeoApiService) {
    super(nuxeoApi);
  }

  protected beforeSetDocument(doc: DocumentModel): Observable<DocumentModel> {
    return this.initializeDocument(doc, this.getDocType());
  }

  protected getSettings(): object[] {
    return [
      new DynamicInputModel({
        id: 'dc:title',
        label: 'Photographer Name',
        maxLength: 50,
        placeholder: 'Title',
        required: true,
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:jobtitle',
        label: 'Project Number',
        document: true,
        required: true,
        settings: {
          placeholder: 'Search Project',
          providerType: SuggestionSettings.CONTENT_VIEW,
          providerName: 'App-Library-PageProvider-Projects-UR-create',
        },
        visibleFn: (doc: DocumentModel): boolean => doc.getParent().getParent().get('app_global:campaign_mgt'),
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Main:campaign',
        label: 'Campaign/Project',
        autoComplete: 'off',
        required: false,
        visibleFn: (doc: DocumentModel): boolean => !doc.getParent().getParent().get('app_global:campaign_mgt'),
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:po_number_internal',
        label: 'PO Number',
        required: true,
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Main:comment',
        label: 'Comment',
        required: false,
        maxLength: 50,
        placeholder: 'Comments',
        autoComplete: 'off',
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Rights:contact_client',
        label: 'Contact Client',
        required: false,
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Talent:photographer_name',
        label: 'Photographer Name',
        required: false,
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Talent:address',
        label: 'Address',
        required: false,
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:brand',
        label: 'Brand',
        required: false,
        document: true,
        placeholder: 'Brand',
        visibleFn: (doc: DocumentModel): boolean => !doc.getParent().getParent().get('app_global:brand_activation'),
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:brand',
        label: 'Brand',
        required: false,
        document: true,
        settings: {
          placeholder: 'Brand',
          providerType: SuggestionSettings.OPERATION,
          providerName: 'javascript.provideBrands',
        },
        visibleFn: (doc: DocumentModel): boolean => doc.getParent().getParent().get('app_global:brand_activation'),
        onResponsed: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:agency',
        label: 'Agency',
        required: false,
        settings: {
          multiple: false,
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Agencies',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:country',
        label: 'Country',
        required: false,
        settings: {
          multiple: true,
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Countries',
        },
      }),
      new DynamicListModel({
        id: 'The_Loupe_Rights:contract_items_usage_types',
        label: 'Contract Items',
        layoutPosition: 'bottom',
        required: false,
        items: [
          new DynamicInputModel({
            id: 'item',
            label: 'Photographer',
            maxLength: 50,
            placeholder: 'item',
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
            // hiddenFn: (doc: DocumentModel): boolean => doc.get('app_global:UsageRights'),
          }),
          new DynamicSuggestionModel<string>({
            id: 'media_usage_type',
            label: 'Media Usage Types',
            required: true,
            document: true,
            settings: {
              placeholder: 'select a value',
              providerType: SuggestionSettings.OPERATION,
              providerName: 'javascript.provideURmediatypes',
            },
            validators: { required: null },
            errorMessages: { required: '{{label}} is required' },
            onResponsed: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
          }),
          new DynamicDatepickerDirectiveModel<string>({
            id: 'start_airing_date',
            label: 'Start Airing Date',
            readonly: true,
            defaultValue: (new Date()),
            required: true,
            validators: { required: null },
            errorMessages: { required: '{{label}} is required' },
          }),

          new DynamicInputModel({
            id: 'contract_duration',
            label: 'Duration (months)',
            required: true,
            validators: {
              required: null,
              pattern: /^[0-9]*[1-9][0-9]*$/,
            },
            errorMessages: {
              required: '{{label}} is required',
              pattern: 'Must positive integer',
            },
          }),
          new DynamicSuggestionModel<string>({
            id: 'contract_countries',
            label: 'Countries',
            required: true,
            settings: {
              multiple: true,
              providerType: SuggestionSettings.DIRECTORY,
              providerName: 'GLOBAL_Countries',
            },
            validators: { required: null },
            errorMessages: { required: '{{label}} is required' },
          }),
          new DynamicCheckboxModel({
            id: 'active_media_usage',
            label: 'Active Media Usage',
          }),
        ],
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAssetZone',
        formMode: 'create',
        uploadType: 'asset',
        layoutPosition: 'right',
        queueLimit: 1,
        placeholder: 'Drop Logo/Image here!',
        acceptTypes: 'image/*,.pdf',
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAssetZone',
        formMode: 'edit',
        uploadType: 'asset',
        layoutPosition: 'right',
        queueLimit: 1,
        placeholder: 'Drop Logo/Image here!',
        acceptTypes: 'image/*,.pdf',
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
        multiUpload: false,
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
      'app_Edges:backslash_category': {
        element: {
          container: 'p-0',
          label: 'col-form-label',
        },
        grid: {
          host: 'col-sm-4',
        },
      },
      'The_Loupe_ProdCredits:production_date': {
        element: {
          container: 'p-0',
          label: 'col-form-label',
        },
        grid: {
          host: 'col-sm-4',
        },
      },
      'app_Edges:Relevant_Country': {
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