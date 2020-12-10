import { Component } from '@angular/core';
import { DocumentModel } from '@core/api';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { DocumentPageService } from '../../../services/document-page.service';
import { DocumentDialogPreviewTemplateComponent } from '../../document-dialog-preview-template.component';

@Component({
  selector: 'creative-asset-template',
  styleUrls: ['../global-document-dialog-template.scss', './creative-asset-template.component.scss'],
  templateUrl: './creative-asset-template.component.html',
})
export class CreativeAssetTemplateDialogComponent extends DocumentDialogPreviewTemplateComponent {

  static readonly NAME: string = 'creative-asset-template';

  shareUrl: string = this.documentPageService.getCurrentFullUrl();

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
  ) {
    super(globalDocumentDialogService, documentPageService);
  }

  protected setDocument(doc: DocumentModel): void {
    if (doc) {
      this.document = doc;
    }
  }
}
