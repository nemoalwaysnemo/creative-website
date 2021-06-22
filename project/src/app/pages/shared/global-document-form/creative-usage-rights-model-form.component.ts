import { Component } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { DynamicSuggestionModel, DynamicInputModel, DynamicOptionTagModel, DynamicDatepickerDirectiveModel, DynamicListModel } from '@core/custom';
import { GlobalDocumentFormComponent } from './global-document-form.component';
import { Observable } from 'rxjs';
import { OptionModel } from '../option-select/option-select.interface';
import { SuggestionSettings } from '../document-form-extension';
import { DocumentPageService, GlobalEvent } from '../services/document-page.service';
import { DocumentFormEvent, DocumentFormSettings } from '../document-form/document-form.interface';
import { CreativeProjectMgtSettings } from '../document-creative-project-mgt/document-creative-project-mgt.interface';

@Component({
  selector: 'creative-usage-rights-model-form',
  template: `<document-form [user]="currentUser" [document]="document" [settings]="formSettings" [beforeSave]="beforeSave" [afterSave]="afterSave" (callback)="onCallback($event)"></document-form>`,
})
export class CreativeUsageRightsModelComponent extends GlobalDocumentFormComponent {

  static readonly NAME: string = 'creative-ur-model-form';

  protected documentType: string = 'App-Library-UsageRights-Talent';

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  protected beforeOnCreation(doc: DocumentModel, user: UserModel, formSettings: DocumentFormSettings): Observable<DocumentModel> {
    return this.initializeDocument(doc, this.getDocType());
  }

  onCallback(event: DocumentFormEvent): void {
    if (!!event.context && event.context.action.button === 'mgt-create'){
      this.goToUsageRights();
    }
    if (event.action === 'CustomButtonClicked' && event.button === 'mgt-cancel'){
      this.goToUsageRights();
    }
  }

  goToUsageRights(): void {
    const setting = new CreativeProjectMgtSettings();
    this.documentPageService.triggerEvent(new GlobalEvent({ name: 'SelectedComponentChanged', data: { view: 'usage-rights-home-view', type: 'view', setting }, type: 'creative-campaign-project-mgt' }));
  }

  protected getFormModels(): any[] {
    return [
      new DynamicInputModel({
        id: 'dc:title',
        label: 'Talent Name',
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
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Rights:contract_type',
        label: 'Contract Type',
        required: true,
        settings: {
          placeholder: 'Select a value',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Library-UR-Talent-contract-types',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Talent:talent_agency',
        label: 'Talent Agency',
        required: true,
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Talent:address',
        label: 'Talent Agency Address',
        required: false,
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:jobtitle',
        label: 'Project Number',
        document: true,
        required: true,
        settings: {
          placeholder: 'Select a value',
          providerType: SuggestionSettings.CONTENT_VIEW,
          providerName: 'App-Library-PageProvider-Projects-UR-create',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:po_number_internal',
        label: 'PO Number',
        required: true,
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Talent:talent_agency_contact',
        label: 'Talent Agency Contact',
        placeholder: 'email',
        required: false,
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:brand',
        label: 'Brand',
        placeholder: 'Brand',
        disabled: true,
        readOnly: true,
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:agency',
        label: 'Agency',
        disabled: true,
        readOnly: true,
        settings: {
          multiple: false,
          placeholder: 'Please select agency',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Agencies',
        },
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:country',
        label: 'Country',
        placeholder: 'Country',
        disabled: true,
        readOnly: true,
        required: false,
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Rights:contact_client',
        label: 'Contact Client',
        required: false,
        placeholder: 'email',
      }),
      new DynamicListModel({
        id: 'The_Loupe_Rights:contract_items_usage_types',
        label: 'Contract Items',
        layoutPosition: 'bottom',
        required: true,
        settings: {
          items: [
            // new DynamicInputModel({
            //   id: 'item',
            //   label: 'Talent',
            //   maxLength: 50,
            //   placeholder: 'item',
            //   autoComplete: 'off',
            //   required: true,
            //   validators: {
            //     required: null,
            //     minLength: 4,
            //   },
            //   errorMessages: {
            //     required: '{{label}} is required',
            //     minLength: 'At least 4 characters',
            //   },
            // }),
            new DynamicSuggestionModel<string>({
              id: 'media_usage_type',
              label: 'Media Usage Types',
              required: true,
              document: true,
              settings: {
                placeholder: 'Select a value',
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
            // new DynamicCheckboxModel({
            //   id: 'active_media_usage',
            //   label: 'Active Media Usage',
            // }),
          ],
        },
      }),
    ];
  }
}
