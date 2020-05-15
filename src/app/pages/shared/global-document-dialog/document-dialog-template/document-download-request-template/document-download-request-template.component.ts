import { Component } from '@angular/core';
import { NuxeoApiService, NuxeoAutomations, DocumentModel } from '@core/api';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DocumentDialogConfirmationComponent } from '../document-confirmation-template/document-confirmation-template.component';
import { SearchQueryParamsService } from '../../../../shared/services/search-query-params.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';

@Component({
  selector: 'document-download-request',
  styleUrls: ['../global-document-dialog-template.scss'],
  templateUrl: './document-download-request-template.component.html',
})
export class DocumentDownloadRequestComponent extends DocumentDialogConfirmationComponent {

  formGroup: FormGroup;

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
    protected formBuilder: FormBuilder,
    protected nuxeoApi: NuxeoApiService,
  ) {
    super(globalDocumentDialogService, queryParamsService);
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
    const subscription = this.nuxeoApi.operation(NuxeoAutomations.DownloadRequest, { 'uuid': doc.uid, message }).subscribe((res: DocumentModel) => {
      const messageType = res.uid ? 'success' : 'error';
      const messageContent = res.uid ? 'The request has been successfully sent!' : 'Request failed to send, please try again';
      this.globalDocumentDialogService.triggerEvent({ name: `DocumentDownloadRequest`, type: 'callback', messageType, messageContent });
      this.close(3000);
    });
    this.subscription.add(subscription);
  }
}
