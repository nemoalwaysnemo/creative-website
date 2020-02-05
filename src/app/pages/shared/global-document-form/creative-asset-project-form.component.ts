import { Component } from '@angular/core';
import { NuxeoApiService, DocumentModel } from '@core/api';
import { DynamicSuggestionModel, DynamicInputModel, DynamicOptionTagModel, DynamicDatepickerDirectiveModel, DynamicCheckboxModel } from '@core/custom';
import { AbstractDocumentFormComponent } from '@pages/shared/abstract-classes/abstract-document-form.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'creative-project-form',
  template: `<document-form [document]="document" [settings]="settings" [layout]="formLayout" [accordions]="accordions" (callback)="callback($event)"></document-form>`,
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
        visibleFn: (doc: DocumentModel): boolean => doc.getParent().getParent().get('app_global:campaign_mgt'),
      },
      {
        name: '+ Backslash',
        visibleFn: (doc: DocumentModel): boolean => doc.getParent().getParent().get('app_global:backslash'),
      },
      {
        name: '+ Usage Rights',
        visibleFn: (doc: DocumentModel): boolean => doc.getParent().getParent().get('app_global:UsageRights'),
      },
    ];
  }

  protected getSettings(): object[] {
    return [
      new DynamicInputModel({
        id: 'dc:title',
        label: 'Project Name',
        autoComplete: 'off',
        required: false,
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:campaign',
        label: 'Search Campaign',
        document: true,
        contentViewProvider: 'App-Library-PageProvider-Campaigns',
        placeholder: 'Select a value',
        required: true,
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
        directoryName: 'GLOBAL_Countries',
        placeholder: 'Select a value',
        required: false,
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
      new DynamicOptionTagModel({
        id: 'app_Edges:Tags_edges',
        label: 'Edges',
        directoryName: 'App-Edges-Edges',
        placeholder: 'Leave blank to copy from campaign.',
        required: false,
        accordionTab: '+ Backslash',
      }),
      // Usage Rights
      new DynamicDatepickerDirectiveModel<string>({
        id: 'The_Loupe_Rights:first-airing',
        label: 'First-Airing',
        readonly: true,
        required: false,
        accordionTab: '+ Usage Rights',
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Rights:contract_mediatypes',
        label: 'Media Usage Types',
        placeholder: 'select Media Usage Type of asset',
        // directoryName: 'App-Edges-Edges',
        required: false,
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
        // providerName: 'App-Lib-UR-PageProvider-Talent-Project-create',
        placeholder: 'select contract',
        required: false,
        accordionTab: '+ Usage Rights',
      }),
      new DynamicCheckboxModel({
        id: 'The_Loupe_Rights:no_music_contract',
        label: 'No Music Contract?',
        accordionTab: '+ Usage Rights',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Talent:Contract-Music-IDs',
        label: 'Music Contracts',
        // providerName: 'App-Lib-UR-PageProvider-Music-Project-create',
        placeholder: 'select contract',
        required: false,
        accordionTab: '+ Usage Rights',
      }),
      new DynamicCheckboxModel({
        id: 'The_Loupe_Rights:no_photographer_contract',
        label: 'No Photographer Contract?',
        accordionTab: '+ Usage Rights',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Talent:Contract-Photographer-IDs',
        label: 'Photographer Contracts',
        // providerName: 'App-Lib-UR-PageProvider-Photographer-Project-create',
        placeholder: 'select contract',
        required: false,
        accordionTab: '+ Usage Rights',
      }),
      new DynamicCheckboxModel({
        id: 'The_Loupe_Rights:no_stock_contract',
        label: 'No Stock Contract?',
        accordionTab: '+ Usage Rights',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Talent:Contract-Stock-IDs',
        label: 'Stock/Illustration Contracts',
        // providerName: 'App-Lib-UR-PageProvider-Stock-Project-create',
        placeholder: 'select contract',
        required: false,
        accordionTab: '+ Usage Rights',
      }),
      new DynamicInputModel({
        id: 'HBC_usage_rights:Font',
        label: 'Font',
        required: false,
        accordionTab: '+ Usage Rights',
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
