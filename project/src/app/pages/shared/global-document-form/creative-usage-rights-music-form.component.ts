import { Component } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { UserModel, DocumentModel } from '@core/api';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel, DynamicOptionTagModel, DynamicDatepickerDirectiveModel, DynamicDragDropFileZoneModel, DynamicCheckboxModel, DynamicListModel } from '@core/custom';
import { GlobalDocumentFormComponent } from './global-document-form.component';
import { SuggestionSettings } from '../document-form-extension';
import { DocumentFormContext, DocumentFormEvent, DocumentFormSettings } from '../document-form/document-form.interface';
import { DocumentPageService, GlobalEvent } from '../services/document-page.service';
import { OptionModel } from '../option-select/option-select.interface';
import { CreativeProjectMgtSettings } from '../document-creative-project-mgt/document-creative-project-mgt.interface';

@Component({
  selector: 'creative-usage-rights-music-form',
  template: '<document-form [user]="currentUser" [document]="document" [settings]="formSettings" [beforeSave]="beforeSave" [afterSave]="afterSave" (callback)="onCallback($event)"></document-form>',
})
export class CreativeUsageRightsMusicComponent extends GlobalDocumentFormComponent {

  static readonly NAME: string = 'creative-ur-music-form';

  protected documentType: string = 'App-Library-UsageRights-Music';

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  protected beforeOnCreation(doc: DocumentModel, user: UserModel, formSettings: DocumentFormSettings): Observable<DocumentModel> {
    return this.initializeDocument(doc, this.getDocType());
  }

  protected beforeOnCallback(event: DocumentFormEvent): Observable<DocumentFormEvent> {
    if (!!event.context && event.context.action.button === 'mgt-create') {
      this.goToUsageRights();
    }
    if (event.action === 'CustomButtonClicked' && event.button === 'mgt-cancel') {
      this.goToUsageRights();
    }
    return observableOf(event);
  }

  goToUsageRights(): void {
    const settings = new CreativeProjectMgtSettings();
    this.documentPageService.triggerEvent(new GlobalEvent({ name: 'SelectedComponentChanged', data: { view: 'usage-rights-home-view', type: 'view', settings }, type: 'creative-campaign-project-mgt' }));
  }

  protected getFormModels(): any[] {
    return [
      new DynamicInputModel({
        id: 'dc:title',
        label: 'Music Company',
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
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Rights:contract_type',
        label: 'Contract Type',
        required: true,
        settings: {
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Library-UR-Music-contract-types',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:jobtitle',
        label: 'Project Number',
        required: true,
        document: true,
        settings: {
          placeholder: 'Search Project',
          providerType: SuggestionSettings.CONTENT_VIEW,
          providerName: 'App-Library-PageProvider-Projects-UR-create',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
        visibleFn: (ctx: DocumentFormContext): boolean => ctx.currentDocument.getParent().getParent().get('app_global:campaign_mgt'),
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Main:campaign',
        label: 'Campaign/Project',
        autoComplete: 'off',
        required: false,
        visibleFn: (ctx: DocumentFormContext): boolean => !ctx.currentDocument.getParent().getParent().get('app_global:campaign_mgt'),
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:po_number_internal',
        label: 'PO Number',
        required: true,
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Main:comment',
        label: 'Comment',
        required: false,
        maxLength: 150,
        placeholder: 'Comments',
        autoComplete: 'off',
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Rights:contact_client',
        label: 'Contact Client',
        required: false,
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:brand',
        label: 'Brand',
        required: false,
        document: true,
        placeholder: 'Brand',
        visibleFn: (ctx: DocumentFormContext): boolean => !ctx.currentDocument.getParent().getParent().get('app_global:brand_activation'),
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:brand',
        label: 'Brand',
        settings: {
          placeholder: 'Brand',
          providerType: SuggestionSettings.OPERATION,
          providerName: 'javascript.provideBrands',
        },
        required: false,
        document: true,
        visibleFn: (ctx: DocumentFormContext): boolean => ctx.currentDocument.getParent().getParent().get('app_global:brand_activation'),
        onResponse: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:agency',
        label: 'Agency',
        required: false,
        settings: {
          multiple: false,
          placeholder: 'Agency',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Agencies',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:country',
        label: 'Country',
        required: false,
        settings: {
          placeholder: 'Country',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Countries',
        },
      }),
      new DynamicListModel({
        id: 'The_Loupe_Rights:contract_items_usage_types',
        label: 'Contract Items',
        layoutPosition: 'bottom',
        required: true,
        settings: {
          items: [
            new DynamicInputModel({
              id: 'item',
              label: 'Music Title',
              maxLength: 150,
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
                providerType: SuggestionSettings.OPERATION,
                providerName: 'javascript.provideURmediatypes',
              },
              validators: { required: null },
              errorMessages: { required: '{{label}} is required' },
              onResponse: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
            }),
            new DynamicDatepickerDirectiveModel<string>({
              id: 'start_airing_date',
              label: 'Start Airing Date',
              readonly: false,
              required: true,
              defaultValue: (new Date()),
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
            new DynamicSuggestionModel<string>({
              id: 'contract_countries',
              label: 'Countries',
              required: true,
              settings: {
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
        },
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'file:content',
        formMode: 'create',
        layoutPosition: 'right',
        settings: {
          queueLimit: 1,
          placeholder: 'Drop Logo/Image here!',
          acceptTypes: 'image/*,.pdf',
        },
      }),
      new DynamicDragDropFileZoneModel<string>({
        id: 'file:content',
        formMode: 'edit',
        layoutPosition: 'right',
        settings: {
          queueLimit: 1,
          placeholder: 'Drop Logo/Image here!',
          acceptTypes: 'image/*,.pdf',
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
          enableAction: false,
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
    ];
  }
}
