import { Component } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { DynamicSuggestionModel, DynamicInputModel, DynamicTextAreaModel, DynamicCheckboxModel } from '@core/custom';
import { GlobalDocumentFormComponent } from '../../../global-document-form/global-document-form.component';
import { DocumentFormContext, DocumentFormSettings, DocumentFormEvent} from '../../../document-form/document-form.interface';
import { SuggestionSettings } from '../../../document-form-extension';
import { concat, Observable, of as observableOf } from 'rxjs';
import { OptionModel } from '../../../option-select/option-select.interface';
import { CreativeProjectMgtSettings } from '../../document-creative-project-mgt.interface';
import { GlobalEvent } from '../../../services/document-page.service';
@Component({
  selector: 'document-creative-project-import-new-request',
  styleUrls: ['../../document-creative-project-mgt.component.scss'],
  templateUrl: './document-creative-project-import-new-request.component.html',
})
export class DocumentCreativeProjectImportNewRequestComponent extends GlobalDocumentFormComponent {

  static readonly NAME: string = 'creative-project-import-project-request-form';

  protected documentType: string = 'App-Library-Import-Project-Request';

  loading: boolean = true;

  setFormDocument(doc: DocumentModel, user: UserModel, formSettings: DocumentFormSettings): void {
    super.setFormDocument(doc, user, formSettings);
    this.loading = false;
  }

  beforeSave: (doc: DocumentModel, ctx: DocumentFormContext) => Observable<DocumentModel> = (doc: DocumentModel, ctx: DocumentFormContext) => {
    doc.setProperty('dc:title', '3rd-party-import');
    return observableOf(doc);
  };

  protected onInit(): void {
    this.setFormSettings({
      showMessageBeforeSave: false,
    });
  }

  protected beforeOnCreation(doc: DocumentModel, user: UserModel, formSettings: DocumentFormSettings): Observable<DocumentModel> {
    return this.initializeDocument(doc, this.getDocType());
  }

  onCallback(event: DocumentFormEvent): void {
    if (event.action === 'Created' || event.action === 'Canceled') {
      this.goHome();
    }
  }

  goHome(): void{
    const settings = new CreativeProjectMgtSettings();
    this.documentPageService.triggerEvent(new GlobalEvent({ name: 'SelectedComponentChanged', data: { view: '3rd-import-home-view', type: 'view', settings }, type: 'creative-campaign-project-mgt' }));
  }

  protected getFormModels(): any[] {
    return [
      new DynamicInputModel({
        id: 'The_Loupe_Delivery:delivery_email',
        label: 'Uploader email',
        required: true,
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicTextAreaModel({
        id: 'The_Loupe_Main:description',
        label: 'Message',
        rows: 3,
        required: false,
      }),
      // to do: should change output from array to string
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Delivery:expiry_days',
        label: 'Maximum days for upload',
        defaultValue: 3,
        settings: {
          placeholder: 3,
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Library-Delivery-expiry-days',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:brand',
        label: 'Brand',
        required: false,
        document: true,
        readOnly: true,
        settings: {
          placeholder: 'Brand',
          providerType: SuggestionSettings.OPERATION,
          providerName: 'javascript.provideBrands',
        },
        onResponse: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:jobtitle',
        label: 'Search Project',
        document: true,
        required: true,
        readOnly: true,
        settings: {
          placeholder: 'Search Project',
          providerType: SuggestionSettings.CONTENT_VIEW,
          providerName: 'App-Library-PageProvider-Projects',
        },
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Delivery:jobtitle_single',
        label: 'Jobtitle Single',
        document: true,
        required: false,
        readOnly: true,
        settings: {
          placeholder: 'Search Project',
          providerType: SuggestionSettings.CONTENT_VIEW,
          providerName: 'App-Library-PageProvider-Projects',
        },
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Main:jobnumber',
        label: 'Job Number',
        required: false,
        readOnly: true,
        validators: { required: null },
        errorMessages: { required: '{{label}} is required' },
      }),
      new DynamicCheckboxModel({
        readOnly: true,
        id: 'app_global:set_defaults',
        label: 'Set Defaults',
      }),
    ];
  }
}
