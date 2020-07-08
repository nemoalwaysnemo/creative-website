import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { DynamicSuggestionModel, DynamicListModel, DynamicInputModel, DynamicOptionTagModel, DynamicDatepickerDirectiveModel } from '@core/custom';
import { BaseDocumentManageComponent } from '../../../../../abstract-classes/base-document-manage.component';
import { DocumentFormEvent } from '../../../../../../shared/document-form/document-form.interface';
import { SuggestionSettings } from '../../../../../directory-suggestion/directory-suggestion-settings';
import { GlobalSearchFormSettings } from '../../../../../global-search-form/global-search-form.interface';

@Component({
  selector: 'creative-project-asset-report-production-information',
  styleUrls: ['../creative-project-asset-completion-report-template.scss'],
  templateUrl: './creative-project-asset-report-production-information.component.html',
})
export class CreativeProjectReportProductionInformationComponent extends BaseDocumentManageComponent {

  showForm: boolean = false;

  redirectUrl: string = this.documentPageService.getCurrentUrl();

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    schemas: ['dublincore', 'The_Loupe_Main', 'The_Loupe_Delivery', 'The_Loupe_Credits', 'The_Loupe_ProdCredits', 'The_Loupe_Rights'],
    source: 'creative-project-asset-report-production-information',
    enableSearchInput: false,
  });

  changeView(): void {
    this.showForm = !this.showForm;
  }

  doc: DocumentModel;

  @Input() document: DocumentModel;

  updateForm(doc: DocumentModel): void {
    this.documentPageService.updateCurrentDocument(doc);
    this.documentPageService.notify(`${doc.title} has been updated successfully!`, '', 'success');
  }

  canceleForm(): void {
    this.changeView();
  }

  onCallback(event: DocumentFormEvent): void {
    if (event.action === 'Updated') {
      this.updateForm(event.doc);
      this.refresh(this.redirectUrl);
    } else if (event.action === 'Canceled') {
      this.canceleForm();
    }
  }

  protected setCurrentDocument(doc: DocumentModel): void {

  }

  protected getSettings(): any[] {
    return [
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:clientName',
        label: 'Client Name',
        required: false,
        placeholder: 'Client Name',
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:brand',
        label: 'Brand',
        required: false,
        placeholder: 'Brand',
      }),
      new DynamicOptionTagModel<string>({
        id: 'The_Loupe_Main:productModel',
        label: 'Product',
        required: false,
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Main:jobnumber',
        label: 'Job Number',
        required: false,
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicDatepickerDirectiveModel<string>({
        id: 'The_Loupe_ProdCredits:production_date',
        label: 'Date',
        formMode: 'edit',
        placeholder: 'Published',
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
      new DynamicInputModel({
        id: 'The_Loupe_ProdCredits:lift_id_1',
        label: 'LIFT 1 ID#',
        required: false,
      }),
      new DynamicInputModel({
        id: 'The_Loupe_ProdCredits:lift_id_1_title',
        label: 'TITLE OF LIFT 1',
        required: false,
      }),
      new DynamicInputModel({
        id: 'The_Loupe_ProdCredits:lift_id_1_length',
        label: 'Length',
        required: false,
      }),
      new DynamicInputModel({
        id: 'The_Loupe_ProdCredits:lift_id_2',
        label: 'LIFT 2 ID#',
        required: false,
      }),
      new DynamicInputModel({
        id: 'The_Loupe_ProdCredits:lift_id_2_title',
        label: 'TITLE OF LIFT 2',
        required: false,
      }),
      new DynamicInputModel({
        id: 'The_Loupe_ProdCredits:lift_id_2_length',
        label: 'Length',
        required: false,
      }),
      new DynamicListModel({
        id: 'The_Loupe_Rights:contract_items_usage_types',
        label: 'TYPE',
        required: false,
        items: [
          new DynamicSuggestionModel<string>({
            id: 'media_usage_type',
            label: 'Media Usage Type',
            required: true,
            document: true,
            settings: {
              placeholder: '',
              providerType: SuggestionSettings.DIRECTORY,
              providerName: 'App-Library-UR-contract-mediatypes',
            },
            validators: { required: null },
            errorMessages: { required: '{{label}} is required' },
          }),
          new DynamicDatepickerDirectiveModel<string>({
            id: 'start_airing_date',
            label: 'Start Airing Date',
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
        ],
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:producer',
        label: 'Producer',
        required: false,
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:businessManager',
        label: 'Business Manager',
        required: false,
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Credits:talentManager',
        label: 'Talent Manager',
        required: false,
      }),
    ];
  }
}
