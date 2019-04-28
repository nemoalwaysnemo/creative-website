import { Component } from '@angular/core';
import { FormDailogBody } from '@pages/shared/preview-dialog/dailog-bodys/form_dailog_body';
import { PreviewDialogService } from '@pages/shared';

@Component({
  selector: 'disruption-form-roadmaps-body',
  styleUrls: ['./disruption-form-roadmaps-dialog.component.scss'],
  templateUrl: './disruption-form-roadmaps-dialog.component.html',
})
export class DisruptionFormRoadmapsDialogComponent extends FormDailogBody {

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  mode: 'create' | 'edit' = 'create';

  protected initDocument(res: any) {
  }

}
