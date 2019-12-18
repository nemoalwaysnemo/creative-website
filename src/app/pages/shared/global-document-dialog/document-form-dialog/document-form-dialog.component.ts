import { Component, ComponentFactoryResolver } from '@angular/core';
import { AbstractDocumentFormDialogComponent } from '../abstract-document-form-dialog.component';
import { GlobalDocumentDialogService } from '../global-document-dialog.service';

@Component({
  selector: 'document-form-dialog',
  styleUrls: ['./document-form-dialog.component.scss'],
  templateUrl: './document-form-dialog.component.html',
})
export class DocumentFormDialogComponent extends AbstractDocumentFormDialogComponent {

  constructor(
    protected dialogService: GlobalDocumentDialogService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(dialogService, componentFactoryResolver);
  }

}
