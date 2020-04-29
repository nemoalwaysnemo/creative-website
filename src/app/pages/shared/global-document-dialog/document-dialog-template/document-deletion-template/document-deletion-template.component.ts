import { Component } from '@angular/core';
import { DocumentDialogConfirmationComponent } from '../document-confirmation-template/document-confirmation-template.component';
import { SearchQueryParamsService } from '../../../../shared/services/search-query-params.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { DocumentModel } from '@core/api';
import { Observable } from 'rxjs';

@Component({
  selector: 'document-dialog-deletion',
  styleUrls: ['../global-document-dialog-template.scss'],
  templateUrl: './document-deletion-template.component.html',
})
export class DocumentDialogDeletionComponent extends DocumentDialogConfirmationComponent {

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
  ) {
    super(globalDocumentDialogService, queryParamsService);
  }

  delete(): void {
    this.deleteDocument(this.document).subscribe(_ => {
      this.confirm(true, 300);
    });
  }

  private deleteDocument(model: DocumentModel): Observable<DocumentModel> {
    return model.moveToTrash();
  }

}
