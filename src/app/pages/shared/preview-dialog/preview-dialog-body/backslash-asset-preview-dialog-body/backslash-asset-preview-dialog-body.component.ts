import { Component } from '@angular/core';
import { PreviewDialogService } from '../../preview-dialog.service';
import { BaseDialogBody } from '../../base-dialog-body';

@Component({
  selector: 'tbwa-backslash-asset-preview-dialog-body',
  styleUrls: ['./backslash-asset-preview-dialog-body.component.scss'],
  templateUrl: './backslash-asset-preview-dialog-body.component.html',
})
export class BackslashAssetPreviewDialogBodyComponent extends BaseDialogBody {

  description: string;

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  protected initDocument(res: any) {
    this.description = res.doc.get('dc:description');
  }

}
