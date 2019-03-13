import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { PreviewDialogService } from '../preview-dialog.service';
import { BaseDialogBody } from '../base-dialog-body';

@Component({
  selector: 'tbwa-disruption-dialog',
  styleUrls: ['./disruption-dialog.component.scss'],
  templateUrl: './disruption-dialog.component.html',
})
export class DisruptionDialogComponent extends BaseDialogBody {

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  protected initDocument(res: any) {}

}
