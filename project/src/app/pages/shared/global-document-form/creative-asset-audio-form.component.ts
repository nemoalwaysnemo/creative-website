import { Component } from '@angular/core';
import { UserModel, DocumentModel } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel, DynamicOptionTagModel, DynamicDatepickerDirectiveModel, DynamicDragDropFileZoneModel, DynamicCheckboxModel } from '@core/custom';
import { SuggestionSettings } from '../document-form-extension';
import { GlobalDocumentFormComponent } from './global-document-form.component';
import { DocumentFormContext, DocumentFormEvent, DocumentFormSettings } from '../document-form/document-form.interface';
import { DocumentPageService, GlobalEvent } from '../services/document-page.service';
import { OptionModel } from '../option-select/option-select.interface';
import { CreativeProjectMgtSettings } from '../document-creative-project-mgt/document-creative-project-mgt.interface';

@Component({
  selector: 'creative-asset-audio-form',
  template: '<document-form [user]="currentUser" [document]="document" [settings]="formSettings" [beforeSave]="beforeSave" [afterSave]="afterSave" (callback)="onCallback($event)"></document-form>',
})
export class CreativeAssetAudioFormComponent extends GlobalDocumentFormComponent {

  static readonly NAME: string = 'creative-asset-audio-form';

  static readonly COMPONENT_TYPE: string = 'form';

  protected documentType: string = 'App-Library-Audio';

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  protected beforeOnCallback(event: DocumentFormEvent): Observable<DocumentFormEvent> {
    if (!!event.context && event.context.action.button === 'mgt-asset-save') {
      this.goToAssetDetail();
    }
    if (event.action === 'CustomButtonClicked' && event.button === 'mgt-asset-cancel') {
      this.goToAssetDetail();
    }
    return observableOf(event);
  }

  goToAssetDetail(): void {
    const settings = new CreativeProjectMgtSettings({ document: this.document, project: this.formSettings.project });
    this.documentPageService.triggerEvent(new GlobalEvent({ name: 'SelectedComponentChanged', data: { view: 'asset-detail-view', type: 'view', settings }, type: 'creative-campaign-project-mgt' }));
  }

  protected beforeOnCreation(doc: DocumentModel, user: UserModel, formSettings: DocumentFormSettings): Observable<DocumentModel> {
    return this.initializeDocument(doc, this.getDocType());
  }

  protected getFormSettings(): any {
    return {
      showUploadMessage: true,
    };
  }

  protected getFormAccordion(): any[] {
    return [
      {
        // #{currentDocument.getPropertyValue('app_global:campaign_mgt')=="0" ? 'hidden' : 'edit'}
        name: '+ Agency Credits',
        visibleFn: (ctx: DocumentFormContext): boolean => ctx.currentDocument.getParent().get('app_global:campaign_mgt'),
      },
      {
        // #{currentDocument.getPropertyValue('app_global:backslash')=="0" ? 'hidden' : 'edit'}
        name: '+ Backslash',
        visibleFn: (ctx: DocumentFormContext): boolean => ctx.currentDocument.getParent().get('app_global:backslash'),
      },
      {
        // #{currentDocument.getPropertyValue('app_global:UsageRights')=="0" ? 'hidden' : 'edit'}
        name: '+ Usage Rights',
        visibleFn: (ctx: DocumentFormContext): boolean => ctx.currentDocument.getParent().get('app_global:UsageRights'),
      },
    ];
  }

  protected getFormModels(): any[] {
    return [
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
        hiddenFn: (ctx: DocumentFormContext): boolean => ctx.formSettings.formMode === 'create',
      }),
      // #{currentDocument.getPropertyValue('app_global:campaign_mgt')=="0" ? 'hidden' : 'edit'}
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:jobtitle',
        label: 'Search Project',
        document: true,
        settings: {
          placeholder: 'Search Project',
          providerType: SuggestionSettings.CONTENT_VIEW,
          providerName: 'App-Library-PageProvider-Projects',
        },
        required: true,
        validators: { required: null },
        errorMessages: { required: '' },
        visibleFn: (ctx: DocumentFormContext): boolean => ctx.currentDocument.getParent().get('app_global:campaign_mgt'),
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
          dateFormatValidator: 'Invalid format. Valid Format MMM D, YYYY',
        },
      }),
      // #{changeableDocument.type === 'App-Library-Audio' ? 'edit' : 'hidden'}
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:assettype',
        label: 'Asset Type',
        document: true,
        required: true,
        settings: {
          multiple: false,
          placeholder: 'What is this asset?',
          providerType: SuggestionSettings.OPERATION,
          providerName: 'javascript.provideAssetType_Audio',
        },
        validators: { required: null },
        errorMessages: { required: '' },
        onResponse: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
      }),
      // {currentDocument.getPropertyValue('app_global:UsageRights')=="0" ? 'hidden' : 'edit'}
      new DynamicDatepickerDirectiveModel<string>({
        id: 'The_Loupe_Rights:first-airing',
        label: 'Live date / airing',
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
        visibleFn: (ctx: DocumentFormContext): boolean => ctx.currentDocument.getParent().get('app_global:UsageRights'),
      }),
      // #{currentDocument.getPropertyValue('app_global:UsageRights')=="0" ? 'edit' : 'hidden'}
      new DynamicDatepickerDirectiveModel<string>({
        id: 'The_Loupe_Rights:first-airing',
        label: 'Live date / airing',
        readonly: false,
        required: true,
        validators: {
          required: null,
          dateFormatValidator: null,
        },
        errorMessages: {
          required: '{{label}} is required',
          dateFormatValidator: 'Invalid {{label}}. Valid Format MMM D, YYYY',
        },
        visibleFn: (ctx: DocumentFormContext): boolean => !ctx.currentDocument.getParent().get('app_global:UsageRights'),
      }),
      // #{currentDocument.getPropertyValue('app_global:UsageRights')=="0" ? 'hidden' : 'edit'}
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
        errorMessages: { required: '' },
        onResponse: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
        visibleFn: (ctx: DocumentFormContext): boolean => ctx.currentDocument.getParent().get('app_global:UsageRights'),
      }),
      // #{currentDocument.getPropertyValue('app_global:UsageRights')=="0" ? 'edit' : 'hidden'}
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
        onResponse: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
        visibleFn: (ctx: DocumentFormContext): boolean => !ctx.currentDocument.getParent().get('app_global:UsageRights'),
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
        onResponse: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
        visibleFn: (ctx: DocumentFormContext): boolean => ctx.currentDocument.getParent().get('app_global_fields:enable_region'),
      }),
      new DynamicInputModel({
        id: 'dc:description',
        label: 'Description',
      }),
      // #{currentDocument.getPropertyValue('app_global:campaign_mgt')=="0" ? 'edit' : 'hidden'}
      new DynamicInputModel({
        id: 'The_Loupe_Main:jobnumber',
        label: 'Job Number',
        visibleFn: (ctx: DocumentFormContext): boolean => !ctx.currentDocument.getParent().get('app_global:campaign_mgt'),
      }),
      // #{currentDocument.getPropertyValue('app_global_fields:enable_po_number_internal')=="0" ? 'hidden' : 'edit'}
      new DynamicOptionTagModel<string>({
        id: 'The_Loupe_Main:po_number_internal',
        label: 'PO Internal',
        visibleFn: (ctx: DocumentFormContext): boolean => ctx.currentDocument.getParent().get('app_global_fields:enable_po_number_internal'),
      }),
      // #{currentDocument.getPropertyValue('app_global:campaign_mgt')=="0" ? 'edit' : 'hidden'}
      new DynamicInputModel({
        id: 'The_Loupe_Main:campaign',
        label: 'Project / Campaign',
        visibleFn: (ctx: DocumentFormContext): boolean => !ctx.currentDocument.getParent().get('app_global:campaign_mgt'),
      }),
      // #{currentDocument.getPropertyValue('app_global_fields:enable_productyear')=="0" ? 'hidden' : 'edit'}
      new DynamicInputModel({
        id: 'The_Loupe_Product_Info:productYear2',
        label: 'Product Year',
        visibleFn: (ctx: DocumentFormContext): boolean => ctx.currentDocument.getParent().get('app_global_fields:enable_productyear'),
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
        onResponse: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
        visibleFn: (ctx: DocumentFormContext): boolean => ctx.currentDocument.getParent().get('app_global_fields:enable_productlist'),
      }),
      // #{currentDocument.getPropertyValue('app_global:networkshare')=="0" ? 'hidden' : 'edit'}
      new DynamicCheckboxModel({
        id: 'app_global:networkshare',
        label: '&nbsp;&nbsp;Add to brand showcase\nAdding assets to the brand showcase shares them with everyone at TBWA\\ globally',
        visibleFn: (ctx: DocumentFormContext): boolean => ctx.currentDocument.getParent().get('app_global:networkshare'),
      }),
      // #{currentDocument.getPropertyValue('app_global:collections')=="0" ? 'hidden' : 'edit'}
      // new DynamicSuggestionModel<string>({
      //   id: 'collectionMember:collectionIds',
      //   label: 'Collections',
      //   visibleFn: (ctx: DocumentFormContext): boolean => ctx.currentDocument.getParent().get('app_global:collections'),
      // }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'file:content',
        formMode: 'create',
        layoutPosition: 'right',
        settings: {
          queueLimit: 25,
          placeholder: 'Drop Audio File(s) here!',
          acceptTypes: '.mp3,.mp4',
        },
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'file:content',
        formMode: 'edit',
        layoutPosition: 'right',
        settings: {
          queueLimit: 1,
          placeholder: 'Replace Main file!',
          acceptTypes: '.mp3,.mp4',
        },
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'files:files',
        formMode: 'edit',
        layoutPosition: 'right',
        settings: {
          queueLimit: 20,
          placeholder: 'Drop to upload attachment',
          acceptTypes: 'image/*,.pdf,.key,.ppt,.zip,.doc,.xls,.mp4',
        },
      }),
      new DynamicBatchUploadModel<string>({
        id: 'batchUpload',
        layoutPosition: 'bottom',
        formMode: 'create',
        settings: {
          enableForm: true,
          enableAction: true,
        },
      }),
      new DynamicBatchUploadModel<string>({
        id: 'batchUpload',
        layoutPosition: 'bottom',
        formMode: 'edit',
        settings: {
          enableForm: false,
          enableAction: true,
        },
      }),
      // Agency Credits
      new DynamicInputModel({
        id: 'The_Loupe_Credits:accountDirector',
        label: 'Account Director',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from project.',
        required: false,
        layoutPosition: 'left',
        accordionTab: '+ Agency Credits',
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:creativeDirector',
        label: 'Creative Director',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from project.',
        required: false,
        layoutPosition: 'left',
        accordionTab: '+ Agency Credits',
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:artDirector',
        label: 'Art Director',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from project.',
        required: false,
        layoutPosition: 'left',
        accordionTab: '+ Agency Credits',
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:copyWriter',
        label: 'Copy Writer',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from project.',
        required: false,
        layoutPosition: 'left',
        accordionTab: '+ Agency Credits',
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:broadcastProducer',
        label: 'Broadcast Producer',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from project.',
        required: false,
        layoutPosition: 'left',
        accordionTab: '+ Agency Credits',
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:printProducer',
        label: 'Print Producer',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from project.',
        required: false,
        layoutPosition: 'left',
        accordionTab: '+ Agency Credits',
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:digitalProducer',
        label: 'Digital Producer',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from project.',
        required: false,
        layoutPosition: 'left',
        accordionTab: '+ Agency Credits',
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:projectManager',
        label: 'Project Manager',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from project.',
        required: false,
        layoutPosition: 'left',
        accordionTab: '+ Agency Credits',
      }),
      // backslash
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:backslash_category',
        label: 'Category',
        required: false,
        layoutPosition: 'left',
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
        layoutPosition: 'left',
        accordionTab: '+ Backslash',
        settings: {
          placeholder: 'Leave blank to copy from project/campaign...',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Edges-Edges',
        },
      }),
      // Usage Rights
      // #{currentDocument.getPropertyValue('app_global:UsageRights_globalref')=="0" ? 'hidden' : 'edit'}
      new DynamicCheckboxModel({
        id: 'app_global:UsageRights_globalref',
        label: 'Global Contract Reference',
        layoutPosition: 'left',
        accordionTab: '+ Usage Rights',
        visibleFn: (ctx: DocumentFormContext): boolean => ctx.currentDocument.getParent().get('app_global:UsageRights_globalref'),
      }),
      new DynamicCheckboxModel({
        id: 'The_Loupe_Rights:no_talent_contract',
        label: 'No Talent Contract',
        layoutPosition: 'left',
        accordionTab: '+ Usage Rights',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Talent:Contract-Model-IDs',
        label: 'Talent Contracts',
        document: true,
        required: false,
        layoutPosition: 'left',
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
        layoutPosition: 'left',
        accordionTab: '+ Usage Rights',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Talent:Contract-Music-IDs',
        label: 'Music Contracts',
        document: true,
        required: false,
        layoutPosition: 'left',
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
        layoutPosition: 'left',
        accordionTab: '+ Usage Rights',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Talent:Contract-Photographer-IDs',
        label: 'Photographer Contracts',
        document: true,
        required: false,
        layoutPosition: 'left',
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
        layoutPosition: 'left',
        accordionTab: '+ Usage Rights',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Talent:Contract-Stock-IDs',
        label: 'Stock Contracts',
        document: true,
        required: false,
        layoutPosition: 'left',
        accordionTab: '+ Usage Rights',
        settings: {
          placeholder: 'Leave blank to copy from project.',
          providerType: SuggestionSettings.CONTENT_VIEW,
          providerName: 'App-Lib-UR-PageProvider-Stock',
        },
      }),
      // new DynamicOptionTagModel({
      //   id: 'The_Loupe_Main:clientName',
      //   label: 'Client',
      //   required: false,
      //   placeholder: 'Client',
      //   disabled: true,
      //   layoutPosition: 'right',
      // }),
      // new DynamicSuggestionModel<string>({
      //   id: 'app_Edges:industry',
      //   label: 'Industry',
      //   disabled: true,
      //   layoutPosition: 'right',
      //   settings: {
      //     placeholder: 'Please select industry',
      //     providerType: SuggestionSettings.DIRECTORY,
      //     providerName: 'GLOBAL_Industries',
      //   },
      // }),
      // // #{currentDocument.getPropertyValue('app_global:brand_activation')=="0" ? 'hidden' : 'edit'}
      // new DynamicSuggestionModel<string>({
      //   id: 'The_Loupe_Main:brand',
      //   label: 'Brand',
      //   required: false,
      //   layoutPosition: 'right',
      //   document: true,
      //   settings: {
      //     placeholder: 'Brand',
      //     providerType: SuggestionSettings.OPERATION,
      //     providerName: 'javascript.provideBrands',
      //   },
      //   visibleFn: (ctx: DocumentFormContext): boolean => ctx.currentDocument.getParent().get('app_global:brand_activation'),
      //   onResponse: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
      // }),
      // // #{currentDocument.getPropertyValue('app_global:brand_activation')=="0" ? 'edit' : 'hidden'}
      // new DynamicOptionTagModel({
      //   id: 'The_Loupe_Main:brand',
      //   label: 'Brand',
      //   required: false,
      //   document: true,
      //   placeholder: 'Brand',
      //   layoutPosition: 'right',
      //   visibleFn: (ctx: DocumentFormContext): boolean => !ctx.currentDocument.getParent().get('app_global:brand_activation'),
      // }),
      // new DynamicSuggestionModel<string>({
      //   id: 'The_Loupe_Main:agency',
      //   label: 'Agency',
      //   layoutPosition: 'right',
      //   settings: {
      //     multiple: false,
      //     placeholder: 'Please select agency',
      //     providerType: SuggestionSettings.DIRECTORY,
      //     providerName: 'GLOBAL_Agencies',
      //   },
      // }),
      // new DynamicSuggestionModel<string>({
      //   id: 'The_Loupe_Main:country',
      //   label: 'Country',
      //   layoutPosition: 'right',
      //   settings: {
      //     placeholder: 'Please select country',
      //     providerType: SuggestionSettings.DIRECTORY,
      //     providerName: 'GLOBAL_Countries',
      //   },
      // }),
    ];
  }
}
