import { Component } from '@angular/core';
import { DocumentDialogConfirmComponent } from '../document-confirm-template/document-confirm-template.component';
import { SearchQueryParamsService } from '../../../../shared/services/search-query-params.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { DocumentModel } from '@core/api';
import { Observable } from 'rxjs';

@Component({
  selector: 'document-dialog-deletion',
  styleUrls: ['../global-document-dialog-template.scss'],
  templateUrl: './document-deletion-template.component.html',
})
export class DocumentDialogDeletionComponent extends DocumentDialogConfirmComponent {

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
  ) {
    super(globalDocumentDialogService, queryParamsService);
  }

  protected delete(): void {
    this.deleteDocument(this.document).subscribe(_ => {
      this.confirm(true, 300);
    });
  }

  private deleteDocument(model: DocumentModel): Observable<DocumentModel> {
    return model.moveToTrash();
  }

}
