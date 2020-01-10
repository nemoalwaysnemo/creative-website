import { Component } from '@angular/core';
import { NuxeoApiService, DocumentModel } from '@core/api';
import { Observable } from 'rxjs';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel, DynamicOptionTagModel, DynamicDatepickerDirectiveModel, DynamicDragDropFileZoneModel, DynamicCheckboxModel } from '@core/custom';
import { AbstractDocumentFormComponent } from '@pages/shared/abstract-classes/abstract-document-form.component';
import { OptionModel } from '../option-select/option-select.interface';

@Component({
  selector: 'creative-asset-audio-form',
  template: `<document-form [document]="document" [settings]="settings" [layout]="formLayout" [accordions]="accordions" (onCreated)="created($event)" (onUpdated)="updated($event)" (onCanceled)="canceled($event)"></document-form>`,
})
export class CreativeAssetAudioFormComponent extends AbstractDocumentFormComponent {

  protected documentType: string = 'App-Library-Audio';

  constructor(protected nuxeoApi: NuxeoApiService) {
    super(nuxeoApi);
  }

  protected beforeSetDocument(doc: DocumentModel): Observable<DocumentModel> {
    return this.initializeDocument(doc.uid, this.getDocType());
  }

  protected getAccordionSettings(): any[] {
    return [
      {
        name: '+ Agency Credits',
        visibleFn: (doc: DocumentModel): boolean => doc.get('app_global:backslash'),
      },
      {
        name: '+ Backslash',
        visibleFn: (doc: DocumentModel): boolean => doc.get('app_global:backslash'),
      },
      {
        name: '+ Usage Rights',
        visibleFn: (doc: DocumentModel): boolean => doc.get('app_global:backslash'),
      },
    ];
  }

  protected getSettings(): object[] {
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
      // #{currentDocument.getPropertyValue('app_global:campaign_mgt')=="0" ? 'hidden' : 'edit'}
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:jobtitle',
        label: 'Search Project',
        placeholder: 'Search Project',
        document: true,
        contentViewProvider: 'App-Library-PageProvider-Projects',
        required: true,
        validators: {
          required: null,
        },
        errorMessages: {
          required: '{{label}} is required',
        },
        hiddenFn: (doc: DocumentModel): boolean => !doc.get('app_global:campaign_mgt'),
      }),
      new DynamicDatepickerDirectiveModel<string>({
        id: 'The_Loupe_ProdCredits:production_date',
        label: 'Production Date',
        readonly: true,
        defaultValue: (new Date()),
        required: true,
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      // #{changeableDocument.type == 'App-Library-Audio' ? 'edit' : 'hidden'}
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:assettype',
        label: 'Asset Type',
        operationName: 'javascript.provideAssetType_Audio',
        placeholder: 'What is this asset?',
        multiple: false,
        document: true,
        required: true,
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
        onResponsed: (res: any) => res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
      }),
      // {currentDocument.getPropertyValue('app_global:UsageRights')=="0" ? 'hidden' : 'edit'}
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
      // #{currentDocument.getPropertyValue('app_global:UsageRights')=="0" ? 'hidden' : 'edit'}
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Rights:contract_mediatypes',
        label: 'Media Usage Types',
        operationName: 'javascript.provideURmediatypes',
        placeholder: 'where is this used?',
        required: true,
        document: true,
        validators: {required: null},
        errorMessages: {required: '{{label}} is required'},
        onResponsed: (res: any) => res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
        hiddenFn: (doc: DocumentModel): boolean => doc.get('app_global:UsageRights'),
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Rights:asset_countries',
        label: 'Asset Country',
        directoryName: 'GLOBAL_Countries',
        placeholder: 'leave blank to copy from agency\\brand',
      }),
      // #{currentDocument.getPropertyValue('app_global_fields:enable_region')=="0" ? 'hidden' : 'edit'}
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:region',
        label: 'Region',
        operationName: 'javascript.provideRegions',
        placeholder: 'Regions this assets was produced for..',
        hiddenFn: (doc: DocumentModel): boolean => !doc.get('app_global_fields:enable_region'),
      }),
      // #{changeableDocument.type == 'App-Library-Video' ? 'edit' : 'hidden'}
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
      // #{currentDocument.getPropertyValue('app_global:campaign_mgt')=="0" ? 'edit' : 'hidden'}
      new DynamicInputModel({
        id: 'The_Loupe_Main:jobnumber',
        label: 'Job Number',
        hiddenFn: (doc: DocumentModel): boolean => doc.get('app_global:campaign_mgt'),
      }),
      // #{currentDocument.getPropertyValue('app_global_fields:enable_po_number_internal')=="0" ? 'hidden' : 'edit'}
      new DynamicOptionTagModel<string>({
        id: 'The_Loupe_Main:po_number_internal',
        label: 'PO Internal',
        hiddenFn: (doc: DocumentModel): boolean => !doc.get('app_global_fields:enable_po_number_internal'),
      }),
      // #{currentDocument.getPropertyValue('app_global:campaign_mgt')=="0" ? 'edit' : 'hidden'}
      new DynamicInputModel({
        id: 'The_Loupe_Main:campaign',
        label: 'Project / Campaign',
        hiddenFn: (doc: DocumentModel): boolean => doc.get('app_global:campaign_mgt'),
      }),
      // #{currentDocument.getPropertyValue('app_global_fields:enable_productyear')=="0" ? 'hidden' : 'edit'}
      new DynamicInputModel({
        id: 'The_Loupe_Product_Info:productYear2',
        label: 'Product Year',
        hiddenFn: (doc: DocumentModel): boolean => !doc.get('app_global_fields:enable_productyear'),
      }),
      // #{currentDocument.getPropertyValue('app_global_fields:enable_productlist')=="0" ? 'hidden' : 'edit'}
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:productModel',
        label: 'Products',
        operationName: 'javascript.provideProducts',
        hiddenFn: (doc: DocumentModel): boolean => !doc.get('app_global_fields:enable_productlist'),
      }),
      // #{currentDocument.getPropertyValue('app_global:networkshare')=="0" ? 'hidden' : 'edit'}
      new DynamicCheckboxModel({
        id: 'app_global:networkshare',
        label: 'Share with TBWA\\Collective',
        hiddenFn: (doc: DocumentModel): boolean => !doc.get('app_global:networkshare'),
      }),
      // #{currentDocument.getPropertyValue('app_global:collections')=="0" ? 'hidden' : 'edit'}
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
        layoutPosition: 'left',
        queueLimit: 1,
        placeholder: 'Drop Audio File here!',
        acceptTypes: '.mp3,.mp4,.wav',
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAttachmentZone',
        uploadType: 'attachment',
        layoutPosition: 'left',
        queueLimit: 20,
        placeholder: 'Drop to upload attachment',
        acceptTypes: 'image/*,.pdf,.key,.ppt,.zip,.doc,.xls,.mp4',
      }),
      // Agency Credits
      new DynamicInputModel({
        id: 'The_Loupe_Credits:accountDirector',
        label: 'Account Director',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from campaign.',
        required: false,
        layoutPosition: 'right',
        accordionTab: '+ Agency Credits',
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:creativeDirector',
        label: 'Creative Director',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from campaign.',
        required: false,
        layoutPosition: 'right',
        accordionTab: '+ Agency Credits',
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:artDirector',
        label: 'Art Director',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from campaign.',
        required: false,
        layoutPosition: 'right',
        accordionTab: '+ Agency Credits',
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:copyWriter',
        label: 'Copy Writer',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from campaign.',
        required: false,
        layoutPosition: 'right',
        accordionTab: '+ Agency Credits',
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:broadcastProducer',
        label: 'Broadcast Producer',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from campaign.',
        required: false,
        layoutPosition: 'right',
        accordionTab: '+ Agency Credits',
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:printProducer',
        label: 'Print Producer',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from campaign.',
        required: false,
        layoutPosition: 'right',
        accordionTab: '+ Agency Credits',
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:digitalProducer',
        label: 'Digital Producer',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from campaign.',
        required: false,
        layoutPosition: 'right',
        accordionTab: '+ Agency Credits',
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:projectManager',
        label: 'Project Manager',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from campaign.',
        required: false,
        layoutPosition: 'right',
        accordionTab: '+ Agency Credits',
      }),
      // backslash
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:backslash_category',
        label: 'Category',
        directoryName: 'App-Backslash-Categories',
        placeholder: 'Leave blank to copy from campaign.',
        required: false,
        accordionTab: '+ Backslash',
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:Tags_edges',
        label: 'Edges',
        directoryName: 'App-Edges-Edges',
        placeholder: 'Leave blank to copy from campaign.',
        required: false,
        accordionTab: '+ Backslash',
      }),
      // Usage Rights
      // #{currentDocument.getPropertyValue('app_global:UsageRights_globalref')=="0" ? 'hidden' : 'edit'}
      new DynamicCheckboxModel({
        id: 'app_global:UsageRights_globalref',
        label: 'Global Contract Reference',
        accordionTab: '+ Usage Rights',
        hiddenFn: (doc: DocumentModel): boolean => !doc.get('app_global:UsageRights_globalref'),
      }),
      new DynamicCheckboxModel({
        id: 'The_Loupe_Rights:no_talent_contract',
        label: 'No Talent Contract',
        accordionTab: '+ Usage Rights',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Talent:Contract-Model-IDs',
        label: 'Talent Contracts',
        document: true,
        contentViewProvider: 'App-Lib-UR-PageProvider-Talent',
        placeholder: 'Leave blank to copy from project.',
        required: false,
        accordionTab: '+ Usage Rights',
      }),
      new DynamicCheckboxModel({
        id: 'The_Loupe_Rights:no_music_contract',
        label: 'No Music Contract',
        accordionTab: '+ Usage Rights',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Talent:Contract-Music-IDs',
        label: 'Music Contracts',
        document: true,
        contentViewProvider: 'App-Lib-UR-PageProvider-Music',
        placeholder: 'Leave blank to copy from project.',
        required: false,
        accordionTab: '+ Usage Rights',
      }),
      new DynamicCheckboxModel({
        id: 'The_Loupe_Rights:no_photographer_contract',
        label: 'No Photographer Contract',
        accordionTab: '+ Usage Rights',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Talent:Contract-Photographer-IDs',
        label: 'Photographer Contracts',
        document: true,
        contentViewProvider: 'App-Lib-UR-PageProvider-Photographer',
        placeholder: 'Leave blank to copy from project.',
        required: false,
        accordionTab: '+ Usage Rights',
      }),
      new DynamicCheckboxModel({
        id: 'The_Loupe_Rights:no_stock_contract',
        label: 'No Stock Contract',
        accordionTab: '+ Usage Rights',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Talent:Contract-Stock-IDs',
        label: 'Stock Contracts',
        document: true,
        contentViewProvider: 'App-Lib-UR-PageProvider-Stock',
        placeholder: 'Leave blank to copy from project.',
        required: false,
        accordionTab: '+ Usage Rights',
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
        directoryName: 'GLOBAL_Industries',
        placeholder: 'Please select industry',
        disabled: true,
        layoutPosition: 'right',
      }),
      // #{currentDocument.getPropertyValue('app_global:brand_activation')=="0" ? 'edit' : 'hidden'}
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:brand',
        label: 'Brand',
        required: false,
        placeholder: 'Brand',
        layoutPosition: 'right',
        hiddenFn: (doc: DocumentModel): boolean => doc.get('app_global:brand_activation'),
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
