import { Component } from '@angular/core';
import { BaseDialogBody } from '@pages/shared/preview-dialog/base-dialog-body';
import { PreviewDialogService } from '@pages/shared';

@Component({
  selector: 'disruption-form-folders-body',
  styleUrls: ['./disruption-form-folders-dialog.component.scss'],
  templateUrl: './disruption-form-folders-dialog.component.html',
})
export class DisruptionFormFoldersDialogComponent extends BaseDialogBody {

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  protected initDocument(res: any) {
  }

}
