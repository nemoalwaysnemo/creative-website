import { Component } from '@angular/core';
import { PreviewDialogService } from '../preview-dialog.service';
import { BaseDialogBody } from '../base-dialog-body';

@Component({
  selector: 'tbwa-disruption-form-dialog',
  styleUrls: ['./disruption-form-dialog.component.scss'],
  templateUrl: './disruption-form-dialog.component.html',
})
export class DisruptionFormDialogComponent extends BaseDialogBody {

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  protected initDocument(res: any) {
  }

}
