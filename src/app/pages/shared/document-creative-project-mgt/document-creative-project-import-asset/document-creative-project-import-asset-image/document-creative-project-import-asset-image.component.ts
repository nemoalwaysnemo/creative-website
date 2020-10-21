import { Component } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel, DynamicOptionTagModel, DynamicDatepickerDirectiveModel, DynamicDragDropFileZoneModel, DynamicCheckboxModel } from '@core/custom';
import { GlobalDocumentFormComponent } from '../../../global-document-form/global-document-form.component';
import { SuggestionSettings } from '../../../directory-suggestion/directory-suggestion-settings';
import { DocumentFormEvent, DocumentFormSettings } from '../../../document-form/document-form.interface';
import { OptionModel } from '../../../option-select/option-select.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'document-creative-project-import-asset-image',
  styleUrls: ['../../document-creative-project-mgt.component.scss'],
  templateUrl: './document-creative-project-import-asset-image.component.html',
})
export class DocumentCreativeProjectImportAssetImageComponent extends GlobalDocumentFormComponent {

  static readonly NAME: string = 'creative-project-import-asset-image-form';

  protected documentType: string = 'App-Library-Image';

  redirectUrl: string = this.documentPageService.getCurrentUrl();

  onCallback(event: DocumentFormEvent): void {
    if (event.action === 'Created') {
      this.documentPageService.notify(`${event.doc.title} has been created successfully!`, '', 'success');
    } else if (event.action === 'Canceled') {
    }
  }

  protected beforeOnCreation(doc: DocumentModel): Observable<DocumentModel> {
    return this.initializeDocument(doc.getParent('brand'), this.getDocType());
  }

  protected getFormAccordion(): any[] {
    return [
      {
        // #{currentDocument.getPropertyValue('app_global:campaign_mgt')=="0" ? 'hidden' : 'edit'}
        name: '+ Agency Credits',
        // visibleFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): boolean => doc.getParent().get('app_global:campaign_mgt'),
      },
      {
        // #{currentDocument.getPropertyValue('app_global:backslash')=="0" ? 'hidden' : 'edit'}
        name: '+ Backslash',
        // visibleFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): boolean => doc.getParent().get('app_global:backslash'),
      },
      {
        // #{currentDocument.getPropertyValue('app_global:UsageRights')=="0" ? 'hidden' : 'edit'}
        name: '+ Usage Rights',
        // visibleFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): boolean => doc.getParent().get('app_global:UsageRights'),
      },
    ];
  }

  protected getFormModels(): any[] {
    return [
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAssetZone',
        formMode: 'create',
        uploadType: 'asset',
        layoutPosition: 'left',
        queueLimit: 25,
        placeholder: 'Drop Image/PDF here!',
        acceptTypes: 'image/*,.pdf',
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAssetZone',
        formMode: 'edit',
        uploadType: 'asset',
        layoutPosition: 'left',
        queueLimit: 1,
        placeholder: 'Drop Image/PDF here!',
        acceptTypes: 'image/*,.pdf',
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAttachmentZone',
        formMode: 'edit',
        uploadType: 'attachment',
        layoutPosition: 'left',
        queueLimit: 20,
        placeholder: 'Drop to upload attachment',
        acceptTypes: 'image/*,.pdf,.key,.ppt,.zip,.doc,.xls,.mp4',
      }),
      new DynamicBatchUploadModel<string>({
        id: 'files:files',
        layoutPosition: 'left',
        formMode: 'create',
        multiUpload: true,
      }),
      new DynamicBatchUploadModel<string>({
        id: 'files:files',
        layoutPosition: 'left',
        formMode: 'edit',
        showInputs: false,
        multiUpload: true,
      }),

      new DynamicInputModel({
        id: 'dc:title',
        label: 'Title',
        maxLength: 150,
        placeholder: 'Title',
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
      // #{currentDocument.getPropertyValue('app_global:campaign_mgt')=="0" ? 'hidden' : 'edit'}
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:jobtitle',
        label: 'Search Project',
        document: true,
        required: true,
        settings: {
          placeholder: 'Search Project',
          providerType: SuggestionSettings.CONTENT_VIEW,
          providerName: 'App-Library-PageProvider-Projects',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
        visibleFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): boolean => doc.get('app_global:campaign_mgt'),
      }),
      new DynamicDatepickerDirectiveModel<string>({
        id: 'The_Loupe_ProdCredits:production_date',
        label: 'Production Date',
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
      // #{changeableDocument.type == 'App-Library-Image' ? 'edit' : 'hidden'}
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:assettype',
        label: 'Asset Type',
        document: true,
        required: true,
        settings: {
          multiple: false,
          placeholder: 'What is this asset?',
          providerType: SuggestionSettings.OPERATION,
          providerName: 'javascript.provideAssetType_Image',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
        onResponsed: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
      }),
      // {currentDocument.getPropertyValue('app_global:UsageRights')=="0" ? 'hidden' : 'edit'}
      new DynamicDatepickerDirectiveModel<string>({
        id: 'The_Loupe_Rights:first-airing',
        label: 'Live date / publishing',
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
        visibleFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): boolean => doc.getParent().get('app_global:UsageRights'),
      }),
      // #{currentDocument.getPropertyValue('app_global:UsageRights')=="0" ? 'edit' : 'hidden'}
      new DynamicDatepickerDirectiveModel<string>({
        id: 'The_Loupe_Rights:first-airing',
        label: 'Live date / publishing',
        required: false,
        readonly: false,
        validators: {
          dateFormatValidator: null,
        },
        errorMessages: {
          dateFormatValidator: 'Invalid {{label}}. Valid Format MMM D, YYYY',
        },
        visibleFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): boolean => !doc.getParent().get('app_global:UsageRights'),
      }),
      // {currentDocument.getPropertyValue('app_global:UsageRights')=="0" ? 'hidden' : 'edit'}
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Rights:contract_mediatypes',
        label: 'Media Usage Types',
        required: true,
        document: true,
        settings: {
          placeholder: 'Where is this used?',
          providerType: SuggestionSettings.OPERATION,
          providerName: 'javascript.provideURmediatypes',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
        onResponsed: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
        visibleFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): boolean => doc.getParent().get('app_global:UsageRights'),
      }),
      // {currentDocument.getPropertyValue('app_global:UsageRights')=="0" ? 'edit' : 'hidden'}
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Rights:contract_mediatypes',
        label: 'Media Usage Type(s)',
        required: false,
        document: true,
        settings: {
          placeholder: 'Where is this used?',
          providerType: SuggestionSettings.OPERATION,
          providerName: 'javascript.provideURmediatypes',
        },
        onResponsed: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
        visibleFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): boolean => !doc.getParent().get('app_global:UsageRights'),
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Rights:asset_countries',
        label: 'Asset Country',
        settings: {
          placeholder: 'Leave blank to copy from agency\\brand',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Countries',
        },
      }),
      // #{currentDocument.getPropertyValue('app_global_fields:enable_region')=="0" ? 'hidden' : 'edit'}
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:region',
        label: 'Region',
        document: true,
        settings: {
          placeholder: 'Regions this assets was produced for..',
          providerType: SuggestionSettings.OPERATION,
          providerName: 'javascript.provideRegions',
        },
        onResponsed: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
        visibleFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): boolean => doc.getParent().get('app_global_fields:enable_region'),
      }),
      // #{currentDocument.getPropertyValue('app_global_fields:enable_productyear')=="0" ? 'hidden' : 'edit'}
      new DynamicInputModel({
        id: 'The_Loupe_Product_Info:productYear2',
        label: 'Product Year',
        visibleFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): boolean => doc.getParent().get('app_global_fields:enable_productyear'),
      }),
      // #{currentDocument.getPropertyValue('app_global_fields:enable_productlist')=="0" ? 'hidden' : 'edit'}
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:productModel',
        label: 'Products',
        document: true,
        settings: {
          providerType: SuggestionSettings.OPERATION,
          providerName: 'javascript.provideProducts',
        },
        onResponsed: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
        visibleFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): boolean => doc.getParent().get('app_global_fields:enable_productlist'),
      }),
      // #{currentDocument.getPropertyValue('app_global:networkshare')=="0" ? 'hidden' : 'edit'}
      new DynamicCheckboxModel({
        id: 'app_global:networkshare',
        label: 'Share with TBWA\\Collective',
        visibleFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): boolean => doc.getParent().get('app_global:networkshare'),
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:accountDirector',
        label: 'Account Director',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from project.',
        required: false,
        layoutPosition: 'right',
        accordionTab: '+ Agency Credits',
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:creativeDirector',
        label: 'Creative Director',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from project.',
        required: false,
        layoutPosition: 'right',
        accordionTab: '+ Agency Credits',
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:artDirector',
        label: 'Art Director',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from project.',
        required: false,
        layoutPosition: 'right',
        accordionTab: '+ Agency Credits',
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:copyWriter',
        label: 'Copy Writer',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from project.',
        required: false,
        layoutPosition: 'right',
        accordionTab: '+ Agency Credits',
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:broadcastProducer',
        label: 'Broadcast Producer',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from project.',
        required: false,
        layoutPosition: 'right',
        accordionTab: '+ Agency Credits',
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:printProducer',
        label: 'Print Producer',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from project.',
        required: false,
        layoutPosition: 'right',
        accordionTab: '+ Agency Credits',
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:digitalProducer',
        label: 'Digital Producer',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from project.',
        required: false,
        layoutPosition: 'right',
        accordionTab: '+ Agency Credits',
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:projectManager',
        label: 'Project Manager',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from project.',
        required: false,
        layoutPosition: 'right',
        accordionTab: '+ Agency Credits',
      }),
      // backslash
      // all items #{currentDocument.getPropertyValue('app_global:backslash')=="0" ? 'hidden' : 'edit'}
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:backslash_category',
        label: 'Category',
        required: false,
        layoutPosition: 'right',
        accordionTab: '+ Backslash',
        settings: {
          placeholder: 'Leave blank to copy from project/campaign...',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Backslash-Categories',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:Tags_edges',
        label: 'Edges',
        required: false,
        layoutPosition: 'right',
        accordionTab: '+ Backslash',
        settings: {
          placeholder: 'Leave blank to copy from project/campaign...',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Edges-Edges',
        },
      }),
      // Usage Rights
      // all items #{currentDocument.getPropertyValue('app_global:UsageRights')=="0" ? 'hidden' : 'edit'}
      // #{currentDocument.getPropertyValue('app_global:UsageRights_globalref')=="0" ? 'hidden' : 'edit'}
      new DynamicCheckboxModel({
        id: 'app_global:UsageRights_globalref',
        label: 'Global Contract Reference',
        layoutPosition: 'right',
        accordionTab: '+ Usage Rights',
        visibleFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): boolean => doc.getParent().get('app_global:UsageRights_globalref'),
      }),
      new DynamicCheckboxModel({
        id: 'The_Loupe_Rights:no_talent_contract',
        label: 'No Talent Contract',
        layoutPosition: 'right',
        accordionTab: '+ Usage Rights',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Talent:Contract-Model-IDs',
        label: 'Talent Contracts',
        document: true,
        required: false,
        layoutPosition: 'right',
        accordionTab: '+ Usage Rights',
        settings: {
          placeholder: 'Leave blank to copy from project.',
          providerType: SuggestionSettings.CONTENT_VIEW,
          providerName: 'App-Lib-UR-PageProvider-Talent',
        },
      }),
      new DynamicCheckboxModel({
        id: 'The_Loupe_Rights:no_music_contract',
        label: 'No Music Contract',
        layoutPosition: 'right',
        accordionTab: '+ Usage Rights',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Talent:Contract-Music-IDs',
        label: 'Music Contracts',
        document: true,
        required: false,
        layoutPosition: 'right',
        accordionTab: '+ Usage Rights',
        settings: {
          placeholder: 'Leave blank to copy from project.',
          providerType: SuggestionSettings.CONTENT_VIEW,
          providerName: 'App-Lib-UR-PageProvider-Music',
        },
      }),
      new DynamicCheckboxModel({
        id: 'The_Loupe_Rights:no_photographer_contract',
        label: 'No Photographer Contract',
        layoutPosition: 'right',
        accordionTab: '+ Usage Rights',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Talent:Contract-Photographer-IDs',
        label: 'Photographer Contracts',
        document: true,
        required: false,
        layoutPosition: 'right',
        accordionTab: '+ Usage Rights',
        settings: {
          placeholder: 'Leave blank to copy from project.',
          providerType: SuggestionSettings.CONTENT_VIEW,
          providerName: 'App-Lib-UR-PageProvider-Photographer',
        },
      }),
      new DynamicCheckboxModel({
        id: 'The_Loupe_Rights:no_stock_contract',
        label: 'No Stock Contract',
        layoutPosition: 'right',
        accordionTab: '+ Usage Rights',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Talent:Contract-Stock-IDs',
        label: 'Stock Contracts',
        document: true,
        required: false,
        layoutPosition: 'right',
        accordionTab: '+ Usage Rights',
        settings: {
          placeholder: 'Leave blank to copy from project.',
          providerType: SuggestionSettings.CONTENT_VIEW,
          providerName: 'App-Lib-UR-PageProvider-Stock',
        },
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:clientName',
        label: 'Client',
        required: false,
        placeholder: 'Client',
        disabled: true,
        layoutPosition: 'right',
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:industry',
        label: 'Industry',
        disabled: true,
        layoutPosition: 'right',
        settings: {
          placeholder: 'Please select industry',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Industries',
        },
      }),
      // #{currentDocument.getPropertyValue('app_global:brand_activation')=="0" ? 'hidden' : 'edit'}
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
        visibleFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): boolean => doc.getParent().get('app_global:brand_activation'),
        onResponsed: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
      }),
      // #{currentDocument.getPropertyValue('app_global:brand_activation')=="0" ? 'edit' : 'hidden'}
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:brand',
        label: 'Brand',
        required: false,
        document: true,
        placeholder: 'Brand',
        layoutPosition: 'right',
        visibleFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): boolean => !doc.getParent().get('app_global:brand_activation'),
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
    ];
  }
}
