
import { AbstractDocumentFormDialogComponent } from '../abstract-document-form-dialog.component';
import { GlobalDocumentDialogService } from '../global-document-dialog.service';
import { Component, Input, Output, EventEmitter, ComponentRef, ViewChild, ViewContainerRef, ComponentFactoryResolver, Type } from '@angular/core';
import { DocumentModel } from '@core/api';
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
