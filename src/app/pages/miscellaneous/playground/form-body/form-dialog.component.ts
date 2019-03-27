import { Component } from '@angular/core';
import { BaseDialogBody } from '@pages/shared/preview-dialog/base-dialog-body';
import { PreviewDialogService } from '@pages/shared';

@Component({
  selector: 'tbwa-form-body',
  styleUrls: ['./form-dialog.component.scss'],
  templateUrl: './form-dialog.component.html',
})
export class FormDialogComponent extends BaseDialogBody {

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  protected initDocument(res: any) {
  }

}
