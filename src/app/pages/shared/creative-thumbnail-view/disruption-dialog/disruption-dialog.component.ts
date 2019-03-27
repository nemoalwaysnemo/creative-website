import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { PreviewDialogService } from '../../preview-dialog/preview-dialog.service';
import { BaseDialogBody } from '../../preview-dialog/base-dialog-body';

@Component({
  selector: 'tbwa-disruption-dialog-body',
  styleUrls: ['./disruption-dialog.component.scss'],
  templateUrl: './disruption-dialog.component.html',
})
export class DisruptionDialogComponent extends BaseDialogBody {

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  protected initDocument(res: any) {}

}
