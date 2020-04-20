import { Component, ComponentFactoryResolver } from '@angular/core';
import { AbstractDocumentFormDialogComponent } from '../abstract-document-form-dialog.component';
import { GlobalDocumentDialogService } from '../global-document-dialog.service';
import { SearchQueryParamsService } from '@pages/shared/services/search-query-params.service';

@Component({
  selector: 'document-form-dialog',
  styleUrls: ['./document-form-dialog.component.scss'],
  templateUrl: './document-form-dialog.component.html',
})
export class DocumentFormDialogComponent extends AbstractDocumentFormDialogComponent {

  constructor(
    protected dialogService: GlobalDocumentDialogService,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected queryParamsService: SearchQueryParamsService,
  ) {
    super(dialogService, componentFactoryResolver, queryParamsService);
  }

}
