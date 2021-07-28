import { Component } from '@angular/core';
import { DocumentPageService } from '../services/document-page.service';
import { DocumentDialogEvent, GlobalDocumentDialogService } from './global-document-dialog.service';
import { DocumentDialogBaseTemplateComponent } from './document-dialog-base-template.component';

@Component({
  template: '',
})
export class DocumentDialogCustomTemplateComponent extends DocumentDialogBaseTemplateComponent {

  static readonly COMPONENT_TYPE: string = 'custom';

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
  ) {
    super(globalDocumentDialogService, documentPageService);
  }

  protected subscribeDialogEvents(): void {
    this.subscribeDialogBuiltInEvents();
  }
}
