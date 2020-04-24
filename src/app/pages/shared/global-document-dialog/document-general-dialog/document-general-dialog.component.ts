import { Component, ComponentFactoryResolver } from '@angular/core';
import { AbstractDocumentDialogComponent } from '../abstract-document-dialog.component';
import { GlobalDocumentDialogService } from '../global-document-dialog.service';
import { SearchQueryParamsService } from '../../services/search-query-params.service';

@Component({
  selector: 'document-general-dialog',
  styleUrls: ['./document-general-dialog.component.scss'],
  templateUrl: './document-general-dialog.component.html',
})
export class DocumentGeneralDialogComponent extends AbstractDocumentDialogComponent {

  constructor(
    protected dialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(dialogService, queryParamsService, componentFactoryResolver);
  }

  protected createComponent(): void {
  }

}
