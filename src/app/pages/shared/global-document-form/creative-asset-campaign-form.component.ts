import { Component } from '@angular/core';
import { NuxeoApiService, DocumentModel } from '@core/api';
import { DynamicSuggestionModel, DynamicInputModel, DynamicOptionTagModel, DynamicDatepickerDirectiveModel, DynamicCheckboxModel } from '@core/custom';
import { GlobalDocumentFormComponent } from './global-document-form.component';
import { SuggestionSettings } from '../directory-suggestion/directory-suggestion-settings';
import { Observable } from 'rxjs';

@Component({
  selector: 'creative-asset-campaign-form',
  template: `<document-form [document]="document" [formMode]="formMode" [settings]="settings" [layout]="formLayout" (callback)="onCallback($event)"></document-form>`,
})
export class CreativeCampaignFormComponent extends GlobalDocumentFormComponent {

  static readonly NAME: string = 'creative-campaign-form';

  protected documentType: string = 'App-Library-Campaign';

  constructor(protected nuxeoApi: NuxeoApiService) {
    super(nuxeoApi);
  }

  protected beforeOnCreation(doc: DocumentModel): Observable<DocumentModel> {
    return this.initializeDocument(doc, this.getDocType());
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
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:brand',
        label: 'Brand',
        placeholder: 'Brand',
        disabled: true,
        readOnly: true,
      }),
      // Backslash
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:backslash_category',
        label: 'Backslash Category',
        required: false,
        settings: {
          placeholder: 'Select a value',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Backslash-Categories',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:Tags_edges',
        label: 'Edges',
        required: true,
        settings: {
          placeholder: 'Select a value',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Edges-Edges',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      // CREDITS
      new DynamicInputModel({
        id: 'The_Loupe_Credits:accountDirector',
        label: 'Account Director',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from campaign.',
        required: false,
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:creativeDirector',
        label: 'Creative Director',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from campaign.',
        required: false,
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:artDirector',
        label: 'Art Director',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from campaign.',
        required: false,
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:copyWriter',
        label: 'Copy Writer',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from campaign.',
        required: false,
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:broadcastProducer',
        label: 'Broadcast Producer',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from campaign.',
        required: false,
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:printProducer',
        label: 'Print Producer',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from campaign.',
        required: false,
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:digitalProducer',
        label: 'Digital Producer',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from campaign.',
        required: false,
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:projectManager',
        label: 'Project Manager',
        autoComplete: 'off',
        placeholder: 'Leave blank to copy from campaign.',
        required: false,
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:Relevant_Country',
        label: 'Campaign Geography',
        required: false,
        settings: {
          placeholder: 'Please select country',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Countries',
        },
      }),
      new DynamicDatepickerDirectiveModel<string>({
        id: 'The_Loupe_ProdCredits:production_date',
        label: 'Campaign Start',
        readonly: false,
        required: false,
        validators: {
          dateFormatValidator: null,
        },
        errorMessages: {
          dateFormatValidator: 'Invalid {{label}}. Valid Format MMM D, YYYY',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Rights:asset_countries',
        label: 'Default Asset Country',
        required: false,
        settings: {
          placeholder: 'Default Country for new assets produced under this campaign.',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Countries',
        },
      }),
      new DynamicCheckboxModel({
        id: 'app_global:set_defaults',
        label: 'Set Defaults',
        readOnly: true,
        disabled: true,
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:clientName',
        label: 'Client',
        required: false,
        placeholder: 'Client',
        disabled: true,
        readOnly: true,
        layoutPosition: 'right',
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:industry',
        label: 'Industry',
        disabled: true,
        readOnly: true,
        layoutPosition: 'right',
        settings: {
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Industries',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:agency',
        label: 'Agency',
        readOnly: true,
        disabled: true,
        layoutPosition: 'right',
        settings: {
          multiple: false,
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Agencies',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:country',
        label: 'Country',
        readOnly: true,
        disabled: true,
        layoutPosition: 'right',
        settings: {
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Countries',
        },
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
