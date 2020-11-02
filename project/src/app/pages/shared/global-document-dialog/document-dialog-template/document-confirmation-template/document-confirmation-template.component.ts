import { Component } from '@angular/core';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { DocumentPageService } from '../../../services/document-page.service';
import { DocumentDialogCustomTemplateComponent } from '../../document-dialog-custom-template.component';

@Component({
  selector: 'document-dialog-confirmation-template',
  styleUrls: ['../global-document-dialog-template.scss'],
  templateUrl: './document-confirmation-template.component.html',
})
export class DocumentDialogConfirmationTemplateComponent extends DocumentDialogCustomTemplateComponent {

  static readonly NAME: string = 'document-dialog-confirmation-template';

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
  ) {
    super(globalDocumentDialogService, documentPageService);
  }

}
