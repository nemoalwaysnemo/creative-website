import { Component } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { DynamicSuggestionModel, DynamicInputModel, DynamicTextAreaModel, DynamicCheckboxModel } from '@core/custom';
import { GlobalDocumentFormComponent } from '../../../global-document-form/global-document-form.component';
import { SuggestionSettings } from '../../../document-form-extension';
import { DocumentFormSettings } from '../../../document-form/document-form.interface';
import { OptionModel } from '../../../option-select/option-select.interface';
import { Observable } from 'rxjs';

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

  beforeSave: (doc: DocumentModel, user: UserModel) => DocumentModel = (doc: DocumentModel, user: UserModel) => {
    doc.properties['dc:title'] = '3rd-party-import';
    return doc;
  }

  protected beforeOnCreation(doc: DocumentModel): Observable<DocumentModel> {
    return this.initializeDocument(doc, this.getDocType());
  }

  protected getFormModels(): any[] {
    return [
      new DynamicInputModel({
        id: 'The_Loupe_Delivery:delivery_email',
        label: 'Uploader email',
      }),
      new DynamicTextAreaModel({
        id: 'The_Loupe_Main:description',
        label: 'Message',
        rows: 3,
        required: false,
      }),
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
        layoutPosition: 'right',
        document: true,
        readOnly: true,
        settings: {
          placeholder: 'Brand',
          providerType: SuggestionSettings.OPERATION,
          providerName: 'javascript.provideBrands',
        },
        onResponsed: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
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
