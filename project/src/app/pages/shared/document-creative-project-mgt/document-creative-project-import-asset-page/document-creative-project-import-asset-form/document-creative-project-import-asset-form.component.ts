import { Component } from '@angular/core';
import { DocumentModel, NuxeoUploadResponse, UserModel, GlobalSearchParams, NuxeoPagination } from '@core/api';
import { DynamicSuggestionModel, DynamicInputModel, DynamicDatepickerDirectiveModel, NgFileService } from '@core/custom';
import { DocumentFormContext, DocumentFormEvent, DocumentFormSettings } from '../../../document-form/document-form.interface';
import { OptionModel } from '../../../option-select/option-select.interface';
import { SuggestionSettings } from '../../../document-form-extension';
import { GlobalSearchFormSettings } from '../../../global-search-form/global-search-form.interface';
import { CreativeProjectMgtSettings } from '../../document-creative-project-mgt.interface';
import { DocumentPageService, GlobalEvent } from '../../../services/document-page.service';
import { isValueEmpty } from '@core/services/helpers';
import { of as observableOf, Observable, Subscription, forkJoin } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';
import { GlobalDocumentFormComponent } from '../../../global-document-form/global-document-form.component';
@Component({
  selector: 'document-creative-project-import-asset-form',
  styleUrls: ['../../document-creative-project-mgt.component.scss', './document-creative-project-import-asset-form.component.scss'],
  templateUrl: './document-creative-project-import-asset-form.component.html',
})
export class DocumentCreativeProjectImportAssetFormComponent extends GlobalDocumentFormComponent {

  static readonly NAME: string = 'creative-project-import-asset-form';

  enableUpload: boolean = false;

  searchFormSettingsAsset: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    enableSearchForm: false,
  });

  constructor(
    protected documentPageService: DocumentPageService,
    private ngFileService: NgFileService,
  ) {
    super(documentPageService);
  }

  protected beforeOnCreation(doc: DocumentModel, user: UserModel, formSettings: DocumentFormSettings): Observable<DocumentModel> {
    return forkJoin([
      this.search(doc.getParent('brand') ? { ecm_uuid: `["${doc.getParent('brand').uid}"]`, pageSize: 1 } : {}), //brand
      this.search(doc.get('The_Loupe_Main:campaign') ? { ecm_uuid: `["${doc.get('The_Loupe_Main:campaign')}"]`, pageSize: 1 } : {}), // campaign
    ]).pipe(
      map((docsList: DocumentModel[][]) => [].concat.apply([], docsList)),
      concatMap((docs: DocumentModel[]) => observableOf(docs[0].setParent(doc, 'project').setParent(docs[1], 'campaign'))),
    );
  }

  private search(params: any = {}): Observable<DocumentModel[]> {
    return params && !isValueEmpty(params) ? this.documentPageService.advanceRequest(new GlobalSearchParams(params)).pipe(
      map((res: NuxeoPagination) => res.entries),
    ) : observableOf([new DocumentModel()]);
  }

  protected getDocumentFormSettings(options: any = {}): DocumentFormSettings {
    return new DocumentFormSettings({
      acceptTypes: 'image/*,.pdf,.mp3,.mp4,.mov,.m4a,.3gp,.3g2,.mj2',
      importSettings: {
        placeholder: 'Drag and Drop files here or click Add',
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
          // defaultValueFn: (ctx: DocumentFormContext): any => ctx.currentDocument.getParent('project').title,
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
          visibleFn: (ctx: DocumentFormContext): boolean => !ctx.currentDocument.getParent().get('app_global:UsageRights_enable_firstairing_mandatory'),
        }),
        new DynamicDatepickerDirectiveModel<string>({
          id: 'The_Loupe_Rights:first-airing',
          label: 'Live date / publishing',
          required: false,
          readonly: false,
          defaultValue: (new Date()),
          validators: {
            dateFormatValidator: null,
          },
          errorMessages: {
            dateFormatValidator: 'Invalid {{label}}. Valid Format MMM D, YYYY',
          },
          visibleFn: (ctx: DocumentFormContext): boolean => ctx.currentDocument.getParent().get('app_global:UsageRights_enable_firstairing_mandatory'),
        }),
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
          defaultValueFn: (ctx: DocumentFormContext): any => {
            const campaing = ctx.currentDocument.getParent().getParent('campaign');
            return campaing ? campaing.get('The_Loupe_Rights:asset_countries') : null;
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
          required: false,
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
        new DynamicDatepickerDirectiveModel<string>({
          id: 'start_airing_date',
          label: 'Start Airing Date',
          readonly: false,
          required: false,
          defaultValue: (new Date()),
          settings: {
            layout: 'direction-horizontal',
          },
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
          id: 'media_usage_type',
          label: 'Media Usage Types',
          required: false,
          document: true,
          settings: {
            placeholder: 'Media Usage Types',
            providerType: SuggestionSettings.OPERATION,
            providerName: 'javascript.provideURmediatypes',
            layout: 'direction-horizontal',
          },
          errorMessages: { required: '{{label}} is required' },
          onResponse: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
        }),
        new DynamicSuggestionModel<string>({
          id: 'The_Loupe_Main:assettype',
          label: 'Asset Type',
          document: true,
          required: false,
          settings: {
            multiple: false,
            placeholder: 'What is this asset?',
            providerType: SuggestionSettings.OPERATION,
            providerName: 'javascript.provideAssetType_Image',
            layout: 'direction-horizontal',
            customClass: 'horizontal-input',
          },
          errorMessages: { required: '{{label}} is required' },
          onResponse: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
        }),
      ],
    });
  }

  protected subscription: Subscription = new Subscription();

  onCallback(event: DocumentFormEvent): void {
    if (event.action === 'Created') {
      // this.showMsg();
      this.goToAssetHome();
    } else if (!this.enableUpload && event.action === 'SharedValueChanged' && this.sharedModelValid(event.formValue)) {
      this.enableUpload = true;
    } else if (event.action === 'Canceled') {
      this.cancelForm();
    }
  }

  // check sharedModelValid functions in document form
  private sharedModelValid(formValue): boolean {
    let requiredAllFilled = true;
    Object.entries(formValue).forEach(([key, value]) => {
      const valid = Object.values(this.getDocumentFormSettings().sharedModel).find((obj) => {
        return obj.name === key && obj.required === true && isValueEmpty(value);
      });
      if (!!valid) {
        requiredAllFilled = false;
      }
    },
    );
    return requiredAllFilled;
  }

  openFileSelectWindow(event: any): void {
    this.ngFileService.triggerEvent({ name: 'openSelectWindow', type: 'ng-file', data: { event } });
  }

  cancelForm(): void {
    const settings = new CreativeProjectMgtSettings();
    this.documentPageService.triggerEvent(new GlobalEvent({ name: 'SelectedComponentChanged', data: { view: 'import-asset-home-view', type: 'view', settings }, type: 'creative-campaign-project-mgt' }));
  }

  goToAssetHome(): void {
    const settings = new CreativeProjectMgtSettings();
    this.documentPageService.triggerEvent(new GlobalEvent({ name: 'SelectedComponentChanged', data: { view: 'asset-home-view', type: 'view', settings }, type: 'creative-campaign-project-mgt' }));
  }

  protected showMsg(): void {
    this.documentPageService.notify('Documents have been created successfully!', '', 'success');
  }

}
