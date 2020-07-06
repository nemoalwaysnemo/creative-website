import { Component, Input } from '@angular/core';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicInputModel, DynamicOptionTagModel, DynamicCheckboxModel, DynamicDragDropFileZoneModel } from '@core/custom';
import { BaseDocumentManageComponent } from '@pages/shared/abstract-classes/base-document-manage.component';
import { ActivatedRoute } from '@angular/router';
import { DocumentModel, NuxeoPermission } from '@core/api';
// import { SuggestionSettings } from '../../../../../directory-suggestion/directory-suggestion-settings';
@Component({
  selector: 'creative-project-asset-report-production-information',
  styleUrls: ['../creative-project-asset-completion-report-template.scss'],
  templateUrl: './creative-project-asset-report-production-information.component.html',
})
export class CreativeProjectReportProductionInformationComponent extends BaseDocumentManageComponent {

  showForm: boolean = false;

  changeView(): void {
    this.showForm = !this.showForm;
  }

  doc: DocumentModel;

  @Input() document: DocumentModel;
  // set document(doc: DocumentModel) {
  //   if (doc) {
  //     this.document = doc;
  //   }
  // }

  protected setCurrentDocument(doc: DocumentModel): void {
    console.info(this.document);
  }

  protected getSettings(): any[] {
    return [
      new DynamicInputModel({
        id: 'dc:title',
        label: 'Title',
        maxLength: 50,
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
      new DynamicCheckboxModel({
        id: 'app_global:campaigns_for_clients',
        label: 'enable Campaigns For Clients',
      }),
      new DynamicCheckboxModel({
        id: 'app_global:projects_for_clients',
        label: 'enable Projects For Clients',
      }),
      new DynamicCheckboxModel({
        id: 'app_global:download_mainfile_for_clients',
        label: 'enable Download Main file For Clients',
      }),
      new DynamicCheckboxModel({
        id: 'app_global:download_attachments_for_clients',
        label: 'enable Download Attachments For Clients',
      }),
      new DynamicCheckboxModel({
        id: 'app_global:collections_for_clients',
        label: 'enable Collections For Clients',
      }),
    ];
  }
}
