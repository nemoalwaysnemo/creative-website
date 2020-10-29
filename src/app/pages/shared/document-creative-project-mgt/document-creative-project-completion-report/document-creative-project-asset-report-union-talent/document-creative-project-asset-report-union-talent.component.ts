import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { DynamicFormGroupModel, DynamicInputModel, DynamicDatepickerDirectiveModel, DynamicRadioGroupModel } from '@core/custom';
import { BaseDocumentManageComponent } from '../../../abstract-classes/base-document-manage.component';
import { DocumentFormEvent, DocumentFormSettings } from '../../../document-form/document-form.interface';
import { GlobalSearchFormSettings } from '../../../global-search-form/global-search-form.interface';

@Component({
  selector: 'document-creative-project-asset-report-union-talent',
  styleUrls: ['../../document-creative-project-mgt.component.scss'],
  templateUrl: './document-creative-project-asset-report-union-talent.component.html',
})
export class DocumentCreativeProjectAssetReportUnionTalentComponent extends BaseDocumentManageComponent {

  showForm: boolean = false;

  redirectUrl: string = this.documentPageService.getCurrentUrl();

  formSettings: DocumentFormSettings = new DocumentFormSettings({
    formMode: 'edit',
  });

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    schemas: ['dublincore', 'The_Loupe_Main', 'The_Loupe_Delivery', 'The_Loupe_Credits', 'The_Loupe_ProdCredits', 'The_Loupe_Rights'],
    source: 'creative-project-asset-report-production-information',
    enableSearchInput: false,
  });

  doc: DocumentModel;

  @Input() document: DocumentModel;

  changeView(): void {
    this.showForm = !this.showForm;
  }

  updateForm(doc: DocumentModel): void {
    if (doc && this.document && doc.uid === this.document.uid) {
      this.document = doc;
    }
    this.documentPageService.notify(`${doc.title} has been updated successfully!`, '', 'success');
    this.changeView();
  }

  cancelForm(): void {
    this.changeView();
  }

  onCallback(event: DocumentFormEvent): void {
    if (event.action === 'Updated') {
      this.updateForm(event.doc);
      this.refresh(this.redirectUrl);
    } else if (event.action === 'Canceled') {
      this.cancelForm();
    }
  }

  protected setCurrentDocument(doc: DocumentModel): void {

  }

  protected getFormModels(): any[] {
    return [
      new DynamicDatepickerDirectiveModel<string>({
        id: 'The_Loupe_ProdCredits:shooting_date',
        label: 'FILM/SHOOT',
        readonly: false,
        defaultValue: (new Date()),
        required: false,
      }),
      new DynamicInputModel({
        id: 'The_Loupe_ProdCredits:shooting_location',
        label: 'LOCATION/STUDIO',
        required: false,
      }),
      new DynamicInputModel({
        id: 'The_Loupe_ProdCredits:film_city_state',
        label: 'FILM CITY/STATE',
        required: false,
      }),
      new DynamicFormGroupModel({
        id: 'The_Loupe_ProdCredits:production_company',
        legend: 'Company',
        group: [
          new DynamicInputModel({
            id: 'production_company',
            label: 'Production Company',
          }),
          new DynamicInputModel({
            id: 'production_company_address',
            label: 'Production Company Address',
          }),
          new DynamicInputModel({
            id: 'production_company_contact',
            label: 'Production Company Contact',
          }),
          new DynamicInputModel({
            id: 'production_company_phone_email',
            label: 'Production Company Phone Email',
          }),
        ],
      }),
      new DynamicFormGroupModel({
        id: 'The_Loupe_ProdCredits:recording',
        legend: 'record',
        group: [
          new DynamicDatepickerDirectiveModel({
            id: 'record_date',
            label: 'RECORD DATE',
            defaultValue: (new Date()),
            required: false,
          }),
          new DynamicInputModel({
            id: 'record_studio',
            label: 'RECORD DATE',
            required: false,
          }),
          new DynamicInputModel({
            id: 'record_city_state',
            label: 'RECORD CITY/STATE',
            required: false,
          }),
        ],
      }),
    ];
  }
}
