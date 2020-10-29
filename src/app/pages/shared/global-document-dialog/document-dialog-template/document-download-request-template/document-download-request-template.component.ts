import { Component } from '@angular/core';
import { NuxeoApiService, NuxeoAutomations, DocumentModel } from '@core/api';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DocumentDialogCustomTemplateComponent } from '../../document-dialog-custom-template.component';
import { DocumentPageService } from '../../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';

@Component({
  selector: 'document-download-request-template',
  styleUrls: ['../global-document-dialog-template.scss'],
  templateUrl: './document-download-request-template.component.html',
})
export class DocumentDownloadRequestTemplateComponent extends DocumentDialogCustomTemplateComponent {

  static readonly NAME: string = 'document-download-request-template';

  formGroup: FormGroup;

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
    protected formBuilder: FormBuilder,
    protected nuxeoApi: NuxeoApiService,
  ) {
    super(globalDocumentDialogService, documentPageService);
  }

  submit(): void {
    const reason = this.formGroup.controls['reason'];
    if (reason.valid && reason.value.trim()) {
      this.setRequest(this.document, reason.value);
    }
  }

  protected onInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    this.formGroup = this.formBuilder.group({ reason: ['', [Validators.required, Validators.minLength(10)]] });
  }

  private setRequest(doc: DocumentModel, message: string): void {
    const subscription = this.nuxeoApi.operation(NuxeoAutomations.DownloadRequest, { uuid: doc.uid, message }).subscribe((res: DocumentModel) => {
      const messageType = res.uid ? 'success' : 'error';
      const messageContent = res.uid ? 'The request has been successfully sent!' : 'Request failed to send, please try again';
      this.globalDocumentDialogService.triggerEvent({ name: `DocumentDownloadRequest`, type: 'callback', messageType, messageContent });
      this.close(3000);
    });
    this.subscription.add(subscription);
  }
}
