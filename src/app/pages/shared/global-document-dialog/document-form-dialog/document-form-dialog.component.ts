
import { AbstractDocumentFormDialogComponent } from '../abstract-document-form-dialog.component';
import { GlobalDocumentDialogService } from '../global-document-dialog.service';
import { Component, Input, Output, EventEmitter, ComponentRef, ViewChild, ViewContainerRef, ComponentFactoryResolver, Type } from '@angular/core';
import { DocumentModel } from '@core/api';
@Component({
  selector: 'document-form-dialog',
  styleUrls: ['./document-form-dialog.component.scss'],
  templateUrl: './document-form-dialog.component.html',
})
export class DocumentFormDialogComponent extends AbstractDocumentFormDialogComponent {

  @Output() onCanceled: EventEmitter<DocumentModel> = new EventEmitter<DocumentModel>();

  constructor(
    protected dialogService: GlobalDocumentDialogService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(dialogService, componentFactoryResolver);
  }

  canceled(doc: DocumentModel): void {
    this.onCanceled.next(doc);
  }
}
