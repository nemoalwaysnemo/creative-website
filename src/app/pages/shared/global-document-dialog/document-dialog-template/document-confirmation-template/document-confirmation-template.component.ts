import { Component } from '@angular/core';
import { AbstractDocumentDialogBaseTemplateComponent } from '../../abstract-document-dialog-base-template.component';
import { SearchQueryParamsService } from '../../../services/search-query-params.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';

@Component({
  selector: 'document-dialog-confirmation',
  styleUrls: ['../global-document-dialog-template.scss'],
  templateUrl: './document-confirmation-template.component.html',
})
export class DocumentDialogConfirmationComponent extends AbstractDocumentDialogBaseTemplateComponent {

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
  ) {
    super(globalDocumentDialogService, queryParamsService);
  }

}
