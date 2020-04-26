import { Component, Input } from '@angular/core';
import { DocumentConfirmDialogComponent } from '../document-confirm-template/document-confirm-template.component';
import { SearchQueryParamsService } from '../../../../shared/services/search-query-params.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';

@Component({
  selector: 'delete-dialog-body',
  styleUrls: ['./delete-dialog-body.component.scss'],
  templateUrl: './delete-dialog-body.component.html',
})
export class DeleteDialogBodyComponent extends DocumentConfirmDialogComponent {

  @Input() trash: boolean = true;

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
  ) {
    super(globalDocumentDialogService, queryParamsService);
  }

}
