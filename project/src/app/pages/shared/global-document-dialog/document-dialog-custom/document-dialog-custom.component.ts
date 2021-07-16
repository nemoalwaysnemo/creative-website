import { Component, ComponentFactoryResolver } from '@angular/core';
import { DocumentDialogContainerComponent } from '../document-dialog-container.component';
import { DocumentDialogEvent, GlobalDocumentDialogService } from '../global-document-dialog.service';
import { DocumentPageService } from '../../services/document-page.service';

@Component({
  selector: 'document-dialog-custom',
  styleUrls: ['./document-dialog-custom.component.scss'],
  templateUrl: './document-dialog-custom.component.html',
})
export class DocumentDialogCustomComponent extends DocumentDialogContainerComponent {

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(globalDocumentDialogService, documentPageService, componentFactoryResolver);
    this.subscribeEvents();
  }

  protected subscribeEvents(): void {
    this.subscription = this.globalDocumentDialogService.onEvent('ViewChanged').subscribe((e: DocumentDialogEvent) => {
      this.loading = true;
      this.destroyDynamicComponent();
      this.createComponent(this.component, e.options.document, e.options.metadata || this.dialogSettings);
      this.loading = false;
    });
  }
}
