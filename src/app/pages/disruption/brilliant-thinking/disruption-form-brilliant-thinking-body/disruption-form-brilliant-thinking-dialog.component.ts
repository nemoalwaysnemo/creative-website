import { Component } from '@angular/core';
import { BaseDialogBody } from '@pages/shared/preview-dialog/base-dialog-body';
import { PreviewDialogService } from '@pages/shared';

@Component({
  selector: 'disruption-form-brilliant-thinking-body',
  styleUrls: ['./disruption-form-brilliant-thinking-dialog.component.scss'],
  templateUrl: './disruption-form-brilliant-thinking-dialog.component.html',
})
export class DisruptionFormBrilliantThinkingDialogComponent extends BaseDialogBody {

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  protected initDocument(res: any) {
  }

  onCreated(docs: any): void {
    this.dialogService.showAlert('success', `${docs[0].title} create success`, 3000);
  }

}
