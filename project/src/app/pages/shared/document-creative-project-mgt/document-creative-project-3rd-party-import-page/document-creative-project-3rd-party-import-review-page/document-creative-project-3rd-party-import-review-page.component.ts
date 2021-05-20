import { Component } from '@angular/core';
import { DocumentModel, UserModel  } from '@core/api';
import { DocumentFormSettings } from '../../../document-form/document-form.interface';
import { GlobalDocumentFormComponent } from '../../../global-document-form/global-document-form.component';
import { DynamicSuggestionModel, DynamicInputModel, DynamicTextAreaModel } from '@core/custom';
import { SuggestionSettings } from '../../../document-form-extension';
@Component({
  selector: 'creative-brand-project-3rd-party-import-review',
  templateUrl: './document-creative-project-3rd-party-import-review-page.component.html',
  styleUrls: ['../../../../../theme/styles/document-metadata-view.scss'],
})
export class DocumentCreativeProject3rdPartyImportReviewComponent extends GlobalDocumentFormComponent {


  static readonly NAME: string = 'creative-project-import-project-request-review-form';

  protected documentType: string = 'App-Library-Import-Project-Request-Review';

  loading: boolean = true;

  loadingRequest: boolean = true;

  requestDocument: DocumentModel;

  setFormDocument(doc: DocumentModel, user: UserModel, formSettings: DocumentFormSettings): void {
    super.setFormDocument(doc, user, formSettings);
    this.loading = false;
    this.requestDocument = this.document;
    this.loadingRequest = false;
  }

  protected onInit(): void {
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
    ];
  }

  }
