import { Component } from '@angular/core';
import { DocumentPageService } from '../../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { DocumentDialogPreviewTemplateComponent } from '../../document-dialog-preview-template.component';

@Component({
  selector: 'backslash-home-asset-preview-dialog',
  styleUrls: ['../global-document-dialog-template.scss'],
  templateUrl: './backslash-home-asset-preview-dialog.component.html',
})
export class BackslashHomeAssetDialogPreviewDialogComponent extends DocumentDialogPreviewTemplateComponent {

  static readonly NAME: string = 'backslash-home-asset-preview';

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
  ) {
    super(globalDocumentDialogService, documentPageService);
  }

}
