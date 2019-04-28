import { Component } from '@angular/core';
import { FormDailogBody } from '@pages/shared/preview-dialog/dailog-bodys/form_dailog_body';
import { PreviewDialogService } from '@pages/shared';

@Component({
  selector: 'disruption-form-brilliant-thinking-body',
  styleUrls: ['./disruption-form-brilliant-thinking-dialog.component.scss'],
  templateUrl: './disruption-form-brilliant-thinking-dialog.component.html',
})
export class DisruptionFormBrilliantThinkingDialogComponent extends FormDailogBody {

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  mode: 'create' | 'edit' = 'create';

  protected initDocument(res: any) {
  }

}
