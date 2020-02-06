import { Component } from '@angular/core';
import { NuxeoApiService, DocumentModel } from '@core/api';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel, DynamicOptionTagModel, DynamicDatepickerDirectiveModel, DynamicDragDropFileZoneModel, DynamicCheckboxModel } from '@core/custom';
import { AbstractDocumentFormComponent } from '@pages/shared/abstract-classes/abstract-document-form.component';
import { Observable } from 'rxjs';
import { OptionModel } from '../option-select/option-select.interface';

@Component({
  selector: 'creative-usage-rights-stock-form',
  template: `<document-form [document]="document" [settings]="settings" [layout]="formLayout" (callback)="callback($event)"></document-form>`,
})
export class CreativeUsageRightsStockComponent extends AbstractDocumentFormComponent {

  protected documentType: string = 'App-Library-UsageRights-Stock';

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
        label: 'Stock Provider Name',
        maxLength: 50,
        placeholder: 'Stock Provider Name',
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
      // #{documentManager.getParentDocument(currentDocument.getRef()).getPropertyValue('campaign_mgt')=="0" ? 'hidden' : 'edit'}
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:jobtitle',
        label: 'Search Project',
        placeholder: 'Search Project',
        document: true,
        contentViewProvider: 'App-Library-PageProvider-Projects-UR-create',
        visibleFn: (doc: DocumentModel): boolean => doc.getParent().getParent().get('app_global:campaign_mgt'),
      }),
      // #{documentManager.getParentDocument(currentDocument.getRef()).getPropertyValue('campaign_mgt')=="0" ? 'edit' : 'hidden'}
      new DynamicInputModel({
        id: 'The_Loupe_Main:campaign',
        label: 'Campaign / Project',
        visibleFn: (doc: DocumentModel): boolean => !doc.getParent().getParent().get('app_global:campaign_mgt'),
      }),
      new DynamicOptionTagModel<string>({
        id: 'The_Loupe_Main:po_number_internal',
        label: 'PO Number',
      }),
      new DynamicInputModel({
        id: 'HBC_general:Comments',
        label: 'Comments',
        maxLength: 50,
        placeholder: 'Comments',
        autoComplete: 'off',
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Talent:talent_agency',
        label: 'Provider Name',
        maxLength: 50,
        placeholder: 'Provider Name',
        autoComplete: 'off',
      }),
      new DynamicOptionTagModel<string>({
        id: 'The_Loupe_Talent:talent_agency_contact',
        label: 'Provider Contact',
      }),
      new DynamicOptionTagModel<string>({
        id: 'The_Loupe_Talent:address',
        label: 'Provider Address',
      }),
      new DynamicInputModel({
        id: 'item',
        label: 'Stock ID',
        maxLength: 50,
        placeholder: 'Stock ID',
        autoComplete: 'off',
        required: true,
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicSuggestionModel<string>({
        id: 'media_usage_type',
        label: 'Media Usage Types',
        placeholder: 'Media Usage Types',
        document: true,
        operationName: 'javascript.provideURmediatypes',
        required: true,
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
        onResponsed: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
      }),
      new DynamicSuggestionModel<string>({
        id: 'contract_countries',
        label: 'Contract Countries',
        placeholder: 'Media Usage Types',
        directoryName: 'GLOBAL_Countries',
        document: true,
        required: true,
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
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
        maxLength: 50,
        autoComplete: 'off',
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
      new DynamicCheckboxModel({
        id: 'active_media_usage',
        label: 'Active Media Usage',
      }),
      // #{documentManager.getParentDocument(currentDocument.getRef()).getPropertyValue('brand_activation')=="0" ? 'hidden' : 'edit'}
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:brand',
        label: 'Brand',
        required: false,
        placeholder: 'Brand',
        layoutPosition: 'right',
        document: true,
        operationName: 'javascript.provideBrands',
        visibleFn: (doc: DocumentModel): boolean => doc.getParent().getParent().get('app_global:brand_activation'),
        onResponsed: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:agency',
        label: 'Agency',
        multiple: false,
        directoryName: 'GLOBAL_Agencies',
        placeholder: 'Please select agency',
        layoutPosition: 'right',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:country',
        label: 'Country',
        directoryName: 'GLOBAL_Countries',
        placeholder: 'Please select country',
        layoutPosition: 'right',
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAssetZone',
        formMode: 'create',
        uploadType: 'asset',
        layoutPosition: 'right',
        queueLimit: 25,
        placeholder: 'Drop Image/PDF here!',
        acceptTypes: 'image/*,.pdf',
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
