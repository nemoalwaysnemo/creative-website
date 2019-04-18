import { Component } from '@angular/core';
import { BaseDialogBody } from '@pages/shared/preview-dialog/base-dialog-body';
import { PreviewDialogService } from '@pages/shared';

@Component({
  selector: 'tbwa-disruption-form-theory-body',
  styleUrls: ['./disruption-form-theory-dialog.component.scss'],
  templateUrl: './disruption-form-theory-dialog.component.html',
})
export class DisruptionFormTheoryDialogComponent extends BaseDialogBody {

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  protected initDocument(res: any) {
  }

}
