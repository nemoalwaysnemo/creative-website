import { Component, ComponentFactoryResolver } from '@angular/core';
import { AbstractDocumentDialogComponent } from '../abstract-document-dialog.component';
import { GlobalDocumentDialogService } from '../global-document-dialog.service';
import { SearchQueryParamsService } from '../../../shared/services/search-query-params.service';

@Component({
  selector: 'document-preview-dialog',
  styleUrls: ['./document-preview-dialog.component.scss'],
  templateUrl: './document-preview-dialog.component.html',
})
export class DocumentPreviewDialogComponent extends AbstractDocumentDialogComponent {

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
