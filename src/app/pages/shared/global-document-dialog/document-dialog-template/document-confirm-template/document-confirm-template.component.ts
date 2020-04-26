import { Component, Input } from '@angular/core';
import { AbstractDocumentDialogTemplateComponent } from '../../abstract-document-dialog-template.component';
import { SearchQueryParamsService } from '../../../../shared/services/search-query-params.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';

@Component({
  selector: 'document-confirm-dialog',
  styleUrls: ['./document-confirm-template.component.scss'],
  templateUrl: './document-confirm-template.component.html',
})
export class DocumentConfirmDialogComponent extends AbstractDocumentDialogTemplateComponent {

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
  ) {
    super(globalDocumentDialogService, queryParamsService);
  }

}
