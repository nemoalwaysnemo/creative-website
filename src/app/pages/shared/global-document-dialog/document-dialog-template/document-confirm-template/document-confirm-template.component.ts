import { Component } from '@angular/core';
import { AbstractDocumentDialogBaseTemplateComponent } from '../../abstract-document-dialog-base-template.component';
import { SearchQueryParamsService } from '../../../../shared/services/search-query-params.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';

@Component({
  selector: 'document-confirm-dialog',
  styleUrls: ['./document-confirm-template.component.scss'],
  templateUrl: './document-confirm-template.component.html',
})
export class DocumentConfirmDialogComponent extends AbstractDocumentDialogBaseTemplateComponent {

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
  ) {
    super(globalDocumentDialogService, queryParamsService);
  }

}
