import { Component, Input } from '@angular/core';
import { GlobalDocumentDialogService } from './global-document-dialog.service';
import { DocumentPageService } from '../services/document-page.service';
import { DocumentDialogCustomTemplateComponent } from './document-dialog-custom-template.component';

@Component({
  template: '',
})
export class DocumentDialogPreviewTemplateComponent extends DocumentDialogCustomTemplateComponent {

  @Input()
  set metadata(metadata: any) {
    if (metadata) {
      this.dialogSettings = Object.assign({}, this.dialogSettings, this.getPreviewSettings(), metadata);
    }
  }

  protected dialogSettings: any = {
    docViewerLayout: 'dialogSlides',
  };

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
  ) {
    super(globalDocumentDialogService, documentPageService);
  }

  protected getPreviewSettings(): any {
    return {};
  }

}
