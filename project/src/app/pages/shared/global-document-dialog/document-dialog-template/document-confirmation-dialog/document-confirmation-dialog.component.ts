import { Component } from '@angular/core';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { DocumentPageService } from '../../../services/document-page.service';
import { DocumentDialogCustomTemplateComponent } from '../../document-dialog-custom-template.component';

@Component({
  selector: 'document-confirmation-dialog',
  styleUrls: ['../global-document-dialog-template.scss'],
  templateUrl: './document-confirmation-dialog.component.html',
})
export class DocumentConfirmationDialogComponent extends DocumentDialogCustomTemplateComponent {

  static readonly NAME: string = 'document-confirmation';

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
  ) {
    super(globalDocumentDialogService, documentPageService);
    // this.subscribeDialogEvents();
  }
}
