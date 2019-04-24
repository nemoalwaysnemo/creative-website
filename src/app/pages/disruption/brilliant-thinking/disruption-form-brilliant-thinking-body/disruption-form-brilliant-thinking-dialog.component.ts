import { Component } from '@angular/core';
import { CreateFormDailogBody } from '@pages/shared/preview-dialog/dailog-bodys/create_form_dailog_body';
import { PreviewDialogService } from '@pages/shared';

@Component({
  selector: 'disruption-form-brilliant-thinking-body',
  styleUrls: ['./disruption-form-brilliant-thinking-dialog.component.scss'],
  templateUrl: './disruption-form-brilliant-thinking-dialog.component.html',
})
export class DisruptionFormBrilliantThinkingDialogComponent extends CreateFormDailogBody {

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  protected initDocument(res: any) {
  }

}
