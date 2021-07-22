import { Component, OnInit, OnChanges, OnDestroy, SimpleChanges, TemplateRef } from '@angular/core';
import { DocumentModel, AdvanceSearchService, UserModel, NuxeoUploadResponse } from '@core/api';
import { concatMap, map } from 'rxjs/operators';
import { DocumentPageService, GlobalDocumentDialogService, GlobalEvent, OptionModel } from '../../shared';
import { DynamicSuggestionModel, DynamicInputModel, DynamicDatepickerDirectiveModel, DynamicListModel, DynamicCheckboxModel } from '@core/custom';
import { GLOBAL_DOCUMENT_DIALOG, GlobalDocumentDialogSettings } from '../../shared/global-document-dialog';
import { DocumentFormContext, DocumentFormEvent, DocumentFormSettings } from '../../shared/document-form/document-form.interface';
import { SuggestionSettings } from '../../shared/document-form-extension';
import { NUXEO_DOC_TYPE, NUXEO_PATH_INFO } from '@environment/environment';

@Component({
  selector: 'playground',
  templateUrl: './playground.component.html',
})
export class PlaygroundComponent implements OnInit, OnChanges, OnDestroy {

  settings: any[] = [];

  document: DocumentModel;

  batchOperationSettings: DocumentFormSettings = new DocumentFormSettings({
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
        validators: {
          required: null,
          dateFormatValidator: null,
        },
        errorMessages: {
          required: '{{label}} is required',
          dateFormatValidator: 'Invalid {{label}}. Valid Format MMM D, YYYY',
        },
      }),
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
        onResponse: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
      }),
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
        visibleFn: (ctx: DocumentFormContext): boolean => ctx.currentDocument.getParent().get('app_global:UsageRights'),
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
        visibleFn: (ctx: DocumentFormContext): boolean => !ctx.currentDocument.getParent().get('app_global:UsageRights'),
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
        onResponse: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
        visibleFn: (ctx: DocumentFormContext): boolean => ctx.currentDocument.getParent().get('app_global:UsageRights'),
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
          customClass: 'horizontal-input',
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
          layout: 'direction-horizontal',
          customClass: 'horizontal-input',
        },

        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
        onResponse: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
      }),
    ],
  });

  dialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({ components: [GLOBAL_DOCUMENT_DIALOG.CUSTOM_DOWNLOAD_REQUEST] });

  constructor(
    private advanceSearchService: AdvanceSearchService,
    private documentPageService: DocumentPageService,
    private globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    this.documentPageService.onEventType('document-form').subscribe((event: GlobalEvent) => {

    });
  }

  ngOnInit(): void {
    // this.load('fe13be03-202f-4e8f-a471-86bb3b846fd9'); //stg
    this.load('883c3b10-a3e7-4f4f-a5fd-a44abaa7f856'); // brand
    // this.create();
    // this.update();
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnDestroy(): void {

  }

  onCallback(event: DocumentFormEvent): void {
    // console.log(111111, event);
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

  private load(uid: string): void {
    this.advanceSearchService.get(uid).subscribe((doc: DocumentModel) => {
      this.document = doc;
    });
  }

  private create(): void {
    this.advanceSearchService.get('c4e41076-c38f-4f8a-848b-8ba45e114530').subscribe((doc: DocumentModel) => {
      this.settings = this.getSettings();
      this.document = new DocumentModel({ path: doc.uid, type: 'App-Library-Image' });
    });
  }

  private update(): void {
    this.advanceSearchService.get('36d9c0a8-8ed0-470e-a331-6712411da7bc/')
      .pipe(
        concatMap((parent: DocumentModel) =>
          this.advanceSearchService.get('d2ba1dc8-59f4-4142-a5cf-9afa626809d1').pipe(
            map((doc: DocumentModel) => {
              doc.setParent(parent);
              return doc;
            }),
          ),
        ),
      )
      .subscribe((doc: DocumentModel) => {
        this.document = doc;
        this.settings = this.getSettings();
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
              onResponse: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
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
