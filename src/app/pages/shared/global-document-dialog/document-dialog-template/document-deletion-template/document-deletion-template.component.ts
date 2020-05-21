import { Component } from '@angular/core';
import { DocumentModel } from '@core/api';
import { Observable } from 'rxjs';
import { AbstractDocumentDialogCustomTemplateComponent } from '../../abstract-document-dialog-custom-template.component';
import { SearchQueryParamsService } from '../../../../shared/services/search-query-params.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';

@Component({
  selector: 'document-dialog-deletion',
  styleUrls: ['../global-document-dialog-template.scss'],
  templateUrl: './document-deletion-template.component.html',
})
export class DocumentDialogDeletionComponent extends AbstractDocumentDialogCustomTemplateComponent {

  static readonly NAME: string = 'document-dialog-deletion';

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
  ) {
    super(globalDocumentDialogService, queryParamsService);
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
      this.queryParamsService.historyBack();
    } else {
      this.refresh();
    }
  }
}
