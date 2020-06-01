import { Component } from '@angular/core';
import { DocumentModel } from '@core/api';
import { Observable } from 'rxjs';
import { DocumentDialogCustomTemplateComponent } from '../../document-dialog-custom-template.component';
import { DocumentPageService } from '../../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';

@Component({
  selector: 'document-dialog-deletion',
  styleUrls: ['../global-document-dialog-template.scss'],
  templateUrl: './document-deletion-template.component.html',
})
export class DocumentDialogDeletionComponent extends DocumentDialogCustomTemplateComponent {

  static readonly NAME: string = 'document-dialog-deletion';

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
  ) {
    super(globalDocumentDialogService, documentPageService);
  }

  delete(): void {
    this.deleteDocument(this.document).subscribe(_ => {
      this.confirm(false, 300);
      this.moveRefresh();
    });
  }

  private deleteDocument(model: DocumentModel): Observable<DocumentModel> {
    return model.moveToTrash();
  }

  private moveRefresh(): void {
    if (!this.redirectUrl) {
      this.documentPageService.historyBack();
    } else {
      this.refresh();
    }
  }
}
