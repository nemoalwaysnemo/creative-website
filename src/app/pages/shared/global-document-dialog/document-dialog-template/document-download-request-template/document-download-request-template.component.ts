import { Component } from '@angular/core';
import { NuxeoApiService, NuxeoAutomations, DocumentModel } from '@core/api';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DocumentDialogConfirmationComponent } from '../document-confirmation-template/document-confirmation-template.component';
import { SearchQueryParamsService } from '../../../../shared/services/search-query-params.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';

@Component({
  selector: 'document-download-request',
  styleUrls: ['../global-document-dialog-template.scss'],
  templateUrl: './document-download-request-template.component.html',
})
export class DocumentDownloadRequestComponent extends DocumentDialogConfirmationComponent {

  title = 'Download Request';

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
    const { content } = this.formGroup.getRawValue();
    if (content.trim()) {
      this.setRequest(this.document, content);
    }
  }

  protected onInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    this.formGroup = this.formBuilder.group({ content: ['', Validators.required] });
  }

  private setRequest(doc: DocumentModel, message: string): void {
    const subscription = this.nuxeoApi.operation(NuxeoAutomations.DownloadRequest, { 'uuid': doc.uid, message }).subscribe();
    this.subscription.add(subscription);
  }
}
