import { Component, Input } from '@angular/core';
import { DynamicSuggestionModel, DynamicBatchUploadModel, DynamicListModel, DynamicInputModel, DynamicOptionTagModel, DynamicDatepickerDirectiveModel } from '@core/custom';
import { BaseDocumentManageComponent } from '@pages/shared/abstract-classes/base-document-manage.component';
import { DocumentModel } from '@core/api';
import { DocumentFormEvent } from '../../../../../../shared/document-form/document-form.interface';
import { SuggestionSettings } from '../../../../../directory-suggestion/directory-suggestion-settings';
import { OptionModel } from '../../../../../option-select/option-select.interface';

@Component({
  selector: 'creative-project-asset-report-allowable-versions',
  styleUrls: ['../creative-project-asset-completion-report-template.scss'],
  templateUrl: './creative-project-asset-report-allowable-versions.component.html',
})
export class CreativeProjectReportAllowableVersionsComponent extends BaseDocumentManageComponent {

  showForm: boolean = false;

  redirectUrl: string = this.documentPageService.getCurrentUrl();

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
    console.info(this.document);
  }

  protected getSettings(): any[] {
    return [
      new DynamicListModel({
        id: 'The_Loupe_ProdCredits:allowable_versions',
        label: 'Allowable Versions',
        required: false,
        items: [
          new DynamicInputModel({
            id: 'code_number',
            label: 'Code Number',
            required: false,
          }),
          new DynamicInputModel({
            id: 'title',
            label: 'Title',
            required: false,
          }),
          new DynamicInputModel({
            id: 'length',
            label: 'Length',
            required: false,
          }),
          new DynamicInputModel({
            id: 'type',
            label: 'Type',
            required: false,
          }),
          new DynamicInputModel({
            id: 'notes',
            label: 'Notes',
            required: false,
          }),
        ],
      }),
    ];
  }
}