import { Component } from '@angular/core';
import { PreviewDialogService } from '../../preview-dialog.service';
import { BaseDialogBodyComponent } from '../../base-dialog-body-component';

@Component({
  selector: 'backslash-home-asset-preview-dialog-body',
  styleUrls: ['../preview-dialog-body.scss'],
  templateUrl: './backslash-home-asset-preview-dialog-body.component.html',
})
export class BackslashHomeAssetPreviewDialogBodyComponent extends BaseDialogBodyComponent {

  description: string;

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  protected initDocument(res: any) {
  }

}
