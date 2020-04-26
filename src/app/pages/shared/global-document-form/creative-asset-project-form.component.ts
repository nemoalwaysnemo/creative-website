import { Component } from '@angular/core';
import { NuxeoApiService, DocumentModel } from '@core/api';
import { Observable } from 'rxjs';
import { DynamicSuggestionModel, DynamicInputModel, DynamicOptionTagModel, DynamicDatepickerDirectiveModel, DynamicCheckboxModel } from '@core/custom';
import { AbstractDocumentFormComponent } from './abstract-document-form.component';
import { SuggestionSettings } from '../directory-suggestion/directory-suggestion-settings';
import { OptionModel } from '../option-select/option-select.interface';
@Component({
  selector: 'creative-project-form',
  template: `<document-form [document]="document" [settings]="settings" [layout]="formLayout" [accordions]="accordions" (callback)="onCallback($event)"></document-form>`,
})
export class CreativeProjectFormComponent extends AbstractDocumentFormComponent {

  protected documentType: string = 'App-Library-Project';

  constructor(protected nuxeoApi: NuxeoApiService) {
    super(nuxeoApi);
  }

  protected beforeSetDocument(doc: DocumentModel): Observable<DocumentModel> {
    return this.initializeDocument(doc, this.getDocType());
  }

  protected getAccordionSettings(): any[] {
    return [
      {
        name: '+ Agency Credits',
        // visibleFn: (doc: DocumentModel): boolean => doc.getParent().getParent().get('app_global:campaign_mgt'),
      },
      {
        name: '+ Backslash',
        // visibleFn: (doc: DocumentModel): boolean => doc.getParent().getParent().get('app_global:backslash'),
      },
      {
        name: '+ Usage Rights',
        // visibleFn: (doc: DocumentModel): boolean => doc.getParent().getParent().get('app_global:UsageRights'),
      },
    ];
  }

  protected getSettings(): object[] {
    return [
      new DynamicInputModel({
        id: 'dc:title',
        label: 'Project Name',
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
        id: 'The_Loupe_Main:campaign',
        label: 'Search Campaign',
        document: true,
        required: true,
        settings: {
          multiple: false,
          placeholder: 'Select a value',
          providerType: SuggestionSettings.CONTENT_VIEW,
          providerName: 'App-Library-PageProvider-Campaigns',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Main:jobnumber',
        label: 'Job Number',
        required: true,
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Rights:asset_countries',
        label: 'Default Asset Country',
        required: false,
        settings: {
          placeholder: 'Leave blank to copy from campaign...',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Countries',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:brand',
        label: 'Brand',
        disabled: true,
        required: false,
        document: true,
        settings: {
          placeholder: 'Brand',
          providerType: SuggestionSettings.OPERATION,
          providerName: 'javascript.provideBrands',
        },
        onResponsed: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:agency',
        label: 'Agency',
        disabled: true,
        required: false,
        settings: {
          multiple: false,
          placeholder: 'Leave blank to copy from agency/campaign',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Agencies',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:country',
        label: 'Country',
        disabled: true,
        settings: {
          placeholder: 'Leave blank to copy from agency/campaign',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Countries',
        },
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:clientName',
        label: 'Client',
        required: false,
        placeholder: 'Client',
        readOnly: true,
        disabled: true,
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:industry',
        label: 'Industry',
        disabled: true,
        settings: {
          placeholder: 'Please select industry',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Industries',
        },
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
        required: false,
        accordionTab: '+ Backslash',
        settings: {
          placeholder: 'Leave blank to copy from campaign.',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Backslash-Categories',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:Tags_edges',
        label: 'Edges',
        required: false,
        accordionTab: '+ Backslash',
        settings: {
          placeholder: 'Leave blank to copy from campaign.',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Edges-Edges',
        },
      }),
      // Usage Rights
      new DynamicDatepickerDirectiveModel<string>({
        id: 'The_Loupe_Rights:first-airing',
        label: 'First-Airing',
        readonly: true,
        required: false,
        accordionTab: '+ Usage Rights',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Rights:contract_mediatypes',
        label: 'Media Usage Types',
        required: false,
        document: true,
        settings: {
          placeholder: 'Select Media Usage Type of asset',
          providerType: SuggestionSettings.OPERATION,
          providerName: 'javascript.provideURmediatypes',
        },
        onResponsed: (res: any) => res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
        accordionTab: '+ Usage Rights',
      }),
      new DynamicCheckboxModel({
        id: 'The_Loupe_Rights:no_talent_contract',
        label: 'No Talent Contract?',
        accordionTab: '+ Usage Rights',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Talent:Contract-Model-IDs',
        label: 'Talent Contracts',
        document: true,
        required: false,
        accordionTab: '+ Usage Rights',
        settings: {
          placeholder: 'Please select contract',
          providerType: SuggestionSettings.CONTENT_VIEW,
          providerName: 'App-Lib-UR-PageProvider-Talent-Project-create',
        },
      }),
      new DynamicCheckboxModel({
        id: 'The_Loupe_Rights:no_music_contract',
        label: 'No Music Contract?',
        accordionTab: '+ Usage Rights',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Talent:Contract-Music-IDs',
        label: 'Music Contracts',
        document: true,
        required: false,
        accordionTab: '+ Usage Rights',
        settings: {
          placeholder: 'Please select contract',
          providerType: SuggestionSettings.CONTENT_VIEW,
          providerName: 'App-Lib-UR-PageProvider-Music-Project-create',
        },
      }),
      new DynamicCheckboxModel({
        id: 'The_Loupe_Rights:no_photographer_contract',
        label: 'No Photographer Contract?',
        accordionTab: '+ Usage Rights',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Talent:Contract-Photographer-IDs',
        label: 'Photographer Contracts',
        document: true,
        required: false,
        accordionTab: '+ Usage Rights',
        settings: {
          placeholder: 'Please select contract',
          providerType: SuggestionSettings.CONTENT_VIEW,
          providerName: 'App-Lib-UR-PageProvider-Photographer-Project-create',
        },
      }),
      new DynamicCheckboxModel({
        id: 'The_Loupe_Rights:no_stock_contract',
        label: 'No Stock Contract?',
        accordionTab: '+ Usage Rights',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Talent:Contract-Stock-IDs',
        label: 'Stock/Illustration Contracts',
        document: true,
        required: false,
        accordionTab: '+ Usage Rights',
        settings: {
          placeholder: 'Please select contract',
          providerType: SuggestionSettings.CONTENT_VIEW,
          providerName: 'App-Lib-UR-PageProvider-Stock-Project-create',
        },
      }),
      // new DynamicInputModel({
      //   id: 'HBC_usage_rights:Font',
      //   label: 'Font',
      //   required: false,
      //   accordionTab: '+ Usage Rights',
      // }),
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
