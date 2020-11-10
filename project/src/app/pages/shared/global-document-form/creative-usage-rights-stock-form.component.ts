import { Component } from '@angular/core';
import { UserModel, DocumentModel } from '@core/api';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel, DynamicOptionTagModel, DynamicDatepickerDirectiveModel, DynamicDragDropFileZoneModel, DynamicCheckboxModel, DynamicListModel } from '@core/custom';
import { GlobalDocumentFormComponent } from './global-document-form.component';
import { Observable } from 'rxjs';
import { OptionModel } from '../option-select/option-select.interface';
import { SuggestionSettings } from '../document-form-extension';
import { DocumentFormSettings } from '../document-form/document-form.interface';
import { DocumentPageService } from '../services/document-page.service';

@Component({
  selector: 'creative-usage-rights-stock-form',
  template: `<document-form [currentUser]="currentUser" [document]="document" [settings]="formSettings" [beforeSave]="beforeSave" [afterSave]="afterSave" (callback)="onCallback($event)"></document-form>`,
})
export class CreativeUsageRightsStockComponent extends GlobalDocumentFormComponent {

  static readonly NAME: string = 'creative-ur-stock-form';

  protected documentType: string = 'App-Library-UsageRights-Stock';

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
        label: 'Stock Provider Name',
        maxLength: 150,
        placeholder: 'Stock Provider Name',
        autoComplete: 'off',
        required: true,
        hidden: true,
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
        document: true,
        settings: {
          placeholder: 'Search Project',
          providerType: SuggestionSettings.CONTENT_VIEW,
          providerName: 'App-Library-PageProvider-Projects-UR-create',
        },
        visibleFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): boolean => doc.getParent().getParent().get('app_global:campaign_mgt'),
      }),
      // #{documentManager.getParentDocument(currentDocument.getRef()).getPropertyValue('campaign_mgt')=="0" ? 'edit' : 'hidden'}
      new DynamicInputModel({
        id: 'The_Loupe_Main:campaign',
        label: 'Campaign / Project',
        visibleFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): boolean => !doc.getParent().getParent().get('app_global:campaign_mgt'),
      }),
      new DynamicOptionTagModel<string>({
        id: 'The_Loupe_Main:po_number_internal',
        label: 'PO Number',
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Main:comment',
        label: 'Comments',
        required: false,
        maxLength: 50,
        placeholder: 'Comments',
        autoComplete: 'off',
      }),
      new DynamicOptionTagModel<string>({
        id: 'The_Loupe_Rights:contact_client',
        label: 'Contact Client',
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
      new DynamicListModel({
        id: 'The_Loupe_Rights:contract_items_usage_types',
        label: 'Contract Items',
        layoutPosition: 'bottom',
        required: false,
        items: [
          new DynamicInputModel({
            id: 'item',
            label: 'Stock ID',
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
          }),
          new DynamicSuggestionModel<string>({
            id: 'media_usage_type',
            label: 'Media Usage Types',
            required: true,
            document: true,
            settings: {
              placeholder: 'Media Usage Types',
              providerType: SuggestionSettings.OPERATION,
              providerName: 'javascript.provideURmediatypes',
            },
            validators: { required: null },
            errorMessages: { required: '{{label}} is required' },
            onResponsed: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
          }),
          new DynamicSuggestionModel<string>({
            id: 'contract_countries',
            label: 'Contract Countries',
            document: true,
            required: true,
            settings: {
              placeholder: 'Please select country',
              providerType: SuggestionSettings.DIRECTORY,
              providerName: 'GLOBAL_Countries',
            },
            validators: { required: null },
            errorMessages: { required: '{{label}} is required' },
          }),
          new DynamicDatepickerDirectiveModel<string>({
            id: 'start_airing_date',
            label: 'Start Airing Date',
            readonly: false,
            defaultValue: (new Date()),
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
          new DynamicCheckboxModel({
            id: 'active_media_usage',
            label: 'Active Media Usage',
          }),
        ],
      }),

      // #{documentManager.getParentDocument(currentDocument.getRef()).getPropertyValue('brand_activation')=="0" ? 'hidden' : 'edit'}
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:brand',
        label: 'Brand',
        required: false,
        layoutPosition: 'right',
        document: true,
        settings: {
          placeholder: 'Brand',
          providerType: SuggestionSettings.OPERATION,
          providerName: 'javascript.provideBrands',
        },
        visibleFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): boolean => doc.getParent().getParent().get('app_global:brand_activation'),
        onResponsed: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
      }),
      // #{documentManager.getParentDocument(currentDocument.getRef()).getPropertyValue('brand_activation')=="0" ? 'edit' : 'hidden'}
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:brand',
        label: 'Brand',
        required: false,
        document: true,
        placeholder: 'Brand',
        layoutPosition: 'right',
        visibleFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): boolean => !doc.getParent().getParent().get('app_global:brand_activation'),
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:agency',
        label: 'Agency',
        layoutPosition: 'right',
        settings: {
          multiple: false,
          placeholder: 'Please select agency',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Agencies',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:country',
        label: 'Country',
        layoutPosition: 'right',
        settings: {
          placeholder: 'Please select country',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Countries',
        },
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
        settings: {
          showInput: true,
          multiUpload: true,
        },
      }),
      new DynamicBatchUploadModel<string>({
        id: 'files:files',
        layoutPosition: 'bottom',
        formMode: 'edit',
        settings: {
          showInput: false,
          multiUpload: true,
        },
      }),
    ];
  }
}
