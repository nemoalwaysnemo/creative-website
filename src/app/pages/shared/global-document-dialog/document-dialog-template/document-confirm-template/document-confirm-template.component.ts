import { Component } from '@angular/core';
import { AbstractDocumentDialogBaseTemplateComponent } from '../../abstract-document-dialog-base-template.component';
import { SearchQueryParamsService } from '../../../../shared/services/search-query-params.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';

@Component({
  selector: 'document-dialog-confirm',
  styleUrls: ['../global-document-dialog-template.scss'],
  templateUrl: './document-confirm-template.component.html',
})
export class DocumentDialogConfirmComponent extends AbstractDocumentDialogBaseTemplateComponent {

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
  ) {
    super(globalDocumentDialogService, queryParamsService);
  }

}
