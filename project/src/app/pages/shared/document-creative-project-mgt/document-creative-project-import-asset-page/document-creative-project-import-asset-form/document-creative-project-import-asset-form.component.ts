import { Component, OnInit, OnChanges, OnDestroy, Input } from '@angular/core';
import { DocumentModel, UserModel, NuxeoUploadResponse, AdvanceSearchService } from '@core/api';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel, DynamicOptionTagModel, DynamicDatepickerDirectiveModel, DynamicDragDropFileZoneModel, DynamicCheckboxModel, DynamicListModel } from '@core/custom';
import { GlobalDocumentFormComponent } from '../../../global-document-form/global-document-form.component';
import { DocumentFormContext, DocumentFormEvent, DocumentFormSettings } from '../../../document-form/document-form.interface';
import { OptionModel } from '../../../option-select/option-select.interface';
import { SuggestionSettings } from '../../../document-form-extension';
import { Observable } from 'rxjs';
import { GlobalSearchFormSettings } from '../../../global-search-form/global-search-form.interface';
import { CreativeProjectMgtSettings } from '../../document-creative-project-mgt.interface';
import { DocumentPageService, GlobalEvent } from '../../../services/document-page.service';
@Component({
  selector: 'document-creative-project-import-asset-form',
  styleUrls: ['../../document-creative-project-mgt.component.scss'],
  templateUrl: './document-creative-project-import-asset-form.component.html',
})
export class DocumentCreativeProjectImportAssetFormComponent implements OnInit, OnDestroy {

  constructor(
    private advanceSearchService: AdvanceSearchService,
    private documentPageService: DocumentPageService,
  ) {
  }
  settings: any[] = [];

  @Input() documentModel: DocumentModel;

  document: DocumentModel;

  searchFormSettingsAsset: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableSearchForm: false,
  });

  bulkImportSettings: DocumentFormSettings = new DocumentFormSettings({
    acceptTypes: 'image/*,.pdf,.mp3,.mp4,.mov,.m4a,.3gp,.3g2,.mj2',
    importSettings: {
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
        id: 'The_Loupe_Main:jobtitle',
        label: 'Search Project',
        document: true,
        required: true,
        layoutPosition: 'leftShared',
        settings: {
          placeholder: 'Search Project',
          providerType: SuggestionSettings.CONTENT_VIEW,
          providerName: 'App-Library-PageProvider-Projects',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
        // visibleFn: (ctx: DocumentFormContext): boolean => ctx.currentDocument.get('app_global:campaign_mgt'),
      }),
      new DynamicDatepickerDirectiveModel<string>({
        id: 'The_Loupe_ProdCredits:production_date',
        label: 'Production Date',
        readonly: false,
        defaultValue: (new Date()),
        required: true,
        layoutPosition: 'leftShared',
        validators: {
          required: null,
          dateFormatValidator: null,
        },
        errorMessages: {
          required: '{{label}} is required',
          dateFormatValidator: 'Invalid {{label}}. Valid Format MMM D, YYYY',
        },
      }),
      // new DynamicSuggestionModel<string>({
      //   id: 'The_Loupe_Main:assettype',
      //   label: 'Asset Type',
      //   document: true,
      //   required: true,
      //   layoutPosition: 'leftShared',
      //   settings: {
      //     multiple: false,
      //     placeholder: 'What is this asset?',
      //     providerType: SuggestionSettings.OPERATION,
      //     providerName: 'javascript.provideAssetType_Image',
      //   },
      //   validators: { required: null },
      //   errorMessages: { required: '{{label}} is required' },
      //   onResponsed: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
      // }),
      // #{changeableDocument.type == 'App-Library-Image' ? 'edit' : 'hidden'}
      new DynamicDatepickerDirectiveModel<string>({
        id: 'The_Loupe_Rights:first-airing',
        label: 'Live date / publishing',
        readonly: false,
        defaultValue: (new Date()),
        required: true,
        layoutPosition: 'leftShared',
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
        label: 'Live date / publishing',
        required: false,
        readonly: false,
        layoutPosition: 'leftShared',
        validators: {
          dateFormatValidator: null,
        },
        errorMessages: {
          dateFormatValidator: 'Invalid {{label}}. Valid Format MMM D, YYYY',
        },
        visibleFn: (ctx: DocumentFormContext): boolean => !ctx.currentDocument.getParent().get('app_global:UsageRights'),
      }),
      // {currentDocument.getPropertyValue('app_global:UsageRights')=="0" ? 'hidden' : 'edit'}
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Rights:contract_mediatypes',
        label: 'Media Usage Types',
        required: true,
        document: true,
        layoutPosition: 'leftShared',
        settings: {
          placeholder: 'Where is this used?',
          providerType: SuggestionSettings.OPERATION,
          providerName: 'javascript.provideURmediatypes',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
        onResponsed: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
        visibleFn: (ctx: DocumentFormContext): boolean => ctx.currentDocument.getParent().get('app_global:UsageRights'),
      }),
      // {currentDocument.getPropertyValue('app_global:UsageRights')=="0" ? 'edit' : 'hidden'}
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Rights:contract_mediatypes',
        label: 'Media Usage Type(s)',
        required: false,
        document: true,
        layoutPosition: 'leftShared',
        settings: {
          placeholder: 'Where is this used?',
          providerType: SuggestionSettings.OPERATION,
          providerName: 'javascript.provideURmediatypes',
        },
        onResponsed: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
        visibleFn: (ctx: DocumentFormContext): boolean => !ctx.currentDocument.getParent().get('app_global:UsageRights'),
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Rights:asset_countries',
        label: 'Asset Country',
        layoutPosition: 'leftShared',
        settings: {
          placeholder: 'Leave blank to copy from agency\\brand',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Countries',
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
          direction: 'horizontal',
        },
        validators: {
          required: null,
          minLength: 4,
        },
        errorMessages: {
          required: '{{label}} is required',
          minLength: 'At least 4 characters',
        },
        // hiddenFn: (doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): boolean => settings.formMode === 'create',
      }),
      // new DynamicSuggestionModel<string>({
      //   id: 'The_Loupe_Main:jobtitle',
      //   label: 'Search Project',
      //   document: true,
      //   required: true,
      //   settings: {
      //     placeholder: 'Search Project',
      //     providerType: SuggestionSettings.CONTENT_VIEW,
      //     providerName: 'App-Library-PageProvider-Projects',
      //     direction: 'horizontal',
      //   },
      //   validators: { required: null },
      //   errorMessages: { required: '' },
      //   visibleFn: (ctx: DocumentFormContext): boolean => ctx.currentDocument.getParent().get('app_global:campaign_mgt'),
      // }),
      // new DynamicDatepickerDirectiveModel<string>({
      //   id: 'The_Loupe_ProdCredits:production_date',
      //   label: 'Production Date',
      //   readonly: false,
      //   defaultValue: (new Date()),
      //   required: true,
      //   layoutPosition: 'left',
      //   settings: {
      //     direction: 'horizontal',
      //   },
      //   validators: {
      //     required: null,
      //     dateFormatValidator: null,
      //   },
      //   errorMessages: {
      //     required: '{{label}} is required',
      //     dateFormatValidator: 'Invalid format. Valid Format MMM D, YYYY',
      //   },
      // }),
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
          direction: 'horizontal',
        },

        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
        onResponsed: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
      }),
    ],
  });

  onCallback(event: DocumentFormEvent): void {
    if (event.action === 'Created') {
      this.goToAssetHome();
    } else if (event.action === 'Canceled') {
      this.cancelForm();
    }
  }

  cancelForm(): void{
    const settings = new CreativeProjectMgtSettings();
    this.documentPageService.triggerEvent(new GlobalEvent({ name: 'SelectedComponentChanged', data: { view: 'import-asset-home-view', type: 'view', settings }, type: 'creative-campaign-project-mgt' }));
  }

  goToAssetHome(): void{
    const settings = new CreativeProjectMgtSettings();
    this.documentPageService.triggerEvent(new GlobalEvent({ name: 'SelectedComponentChanged', data: { view: 'asset-home-view', type: 'view', settings }, type: 'creative-campaign-project-mgt' }));
  }


  ngOnInit(): void {
    this.load(this.documentModel.getParent('brand').uid); // brand
  }


  ngOnDestroy(): void {

  }

  private load(uid: string): void {
    this.advanceSearchService.get(uid).subscribe((doc: DocumentModel) => {
      this.document = doc;
    });
  }


  private getSettings(): object[] {
    return [
      new DynamicInputModel({
        id: 'dc:title',
        label: 'Title',
        maxLength: 50,
        placeholder: 'Title',
        autoComplete: 'off',
        required: false,
        validators: {
          required: null,
          minLength: 4,
        },
        errorMessages: {
          required: '{{label}} is required',
          minLength: 'At least 4 characters',
        },
        hiddenFn: (ctx: DocumentFormContext): boolean => ctx.currentDocument.get('app_global:UsageRights'),
      }),
      new DynamicListModel({
        id: 'The_Loupe_Rights:contract_items_usage_types',
        label: 'Contract Items',
        required: false,
        settings: {
          items: [
            new DynamicInputModel({
              id: 'item',
              label: 'item name',
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
              hiddenFn: (ctx: DocumentFormContext): boolean => ctx.currentDocument.get('app_global:UsageRights'),
            }),
            new DynamicSuggestionModel<string>({
              id: 'media_usage_type',
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
              // visibleFn: (ctx: DocumentFormContext): boolean => ctx.currentDocument.getParent().get('app_global:UsageRights'),
            }),
            new DynamicSuggestionModel<string>({
              id: 'contract_countries',
              label: 'Country',
              required: true,
              settings: {
                placeholder: 'Country',
                providerType: SuggestionSettings.DIRECTORY,
                providerName: 'GLOBAL_Countries',
              },
            }),
            new DynamicInputModel({
              id: 'contract_duration',
              label: 'Duration',
              placeholder: 'month',
              required: true,
              validators: { required: null, minLength: 1 },
              errorMessages: {
                required: '{{label}} is required',
                minLength: 'At least 1 characters',
              },
            }),
            new DynamicDatepickerDirectiveModel<string>({
              id: 'start_airing_date',
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
            new DynamicCheckboxModel({
              id: 'active_media_usage',
              label: 'Active',
            }),
          ],
        },
      }),
    ];
  }

}
