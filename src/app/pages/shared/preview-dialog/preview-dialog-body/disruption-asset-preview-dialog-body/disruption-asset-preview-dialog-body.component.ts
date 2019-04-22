import { Component, Input } from '@angular/core';
import { BaseDialogBody } from '../../base-dialog-body';
import { PreviewDialogService } from '../../preview-dialog.service';

@Component({
  selector: 'tbwa-disruption-asset-preview-dialog-body',
  styleUrls: ['../preview-dialog-body.scss'],
  templateUrl: './disruption-asset-preview-dialog-body.component.html',
})
export class DisruptionAssetPreviewDialogBodyComponent extends BaseDialogBody {

  title: string;

  @Input() moreInfo: boolean = false;

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  protected initDocument(res: any) {
    this.title = res.options.title;
  }

}
