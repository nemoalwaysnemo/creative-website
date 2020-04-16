import { Component } from '@angular/core';
import { PreviewDialogService } from '../../preview-dialog.service';
import { BaseDialogBody } from '../../base-dialog-body';

@Component({
  selector: 'backslash-home-asset-preview-dialog-body',
  styleUrls: ['../preview-dialog-body.scss'],
  templateUrl: './backslash-home-asset-preview-dialog-body.component.html',
})
export class BackslashHomeAssetPreviewDialogBodyComponent extends BaseDialogBody {

  description: string;

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  protected initDocument(res: any) {
  }

}
