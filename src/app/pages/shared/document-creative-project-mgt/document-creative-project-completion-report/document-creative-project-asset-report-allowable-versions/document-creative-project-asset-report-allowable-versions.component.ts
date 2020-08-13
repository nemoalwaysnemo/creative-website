import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { DynamicListModel, DynamicInputModel  } from '@core/custom';
import { DocumentFormEvent } from '../../../document-form/document-form.interface';
import { BaseDocumentManageComponent } from '../../../abstract-classes/base-document-manage.component';
@Component({
  selector: 'document-creative-project-asset-report-allowable-versions',
  styleUrls: ['../../document-creative-project-mgt.component.scss'],
  templateUrl: './document-creative-project-asset-report-allowable-versions.component.html',
})
export class DocumentCreativeProjectReportAllowableVersionsComponent extends BaseDocumentManageComponent {

  showForm: boolean = false;

  redirectUrl: string = this.documentPageService.getCurrentUrl();

  changeView(): void {
    this.showForm = !this.showForm;
  }

  doc: DocumentModel;

  @Input() document: DocumentModel;

  updateForm(doc: DocumentModel): void {
    if (doc && this.document && doc.uid === this.document.uid) {
      this.document = doc;
    }
    this.documentPageService.notify(`${doc.title} has been updated successfully!`, '', 'success');
    this.changeView();
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
