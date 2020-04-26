import { Component } from '@angular/core';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';

@Component({
  selector: 'backslash-asset-preview-dialog-body',
  styleUrls: ['./backslash-asset-preview-dialog-body.component.scss'],
  templateUrl: './backslash-asset-preview-dialog-body.component.html',
})
export class BackslashAssetPreviewDialogBodyComponent {

  description: string;

  constructor(protected globalDocumentDialogService: GlobalDocumentDialogService) {
  }

  protected initDocument(res: any) {
    this.description = res.doc.get('dc:description');
  }

}
