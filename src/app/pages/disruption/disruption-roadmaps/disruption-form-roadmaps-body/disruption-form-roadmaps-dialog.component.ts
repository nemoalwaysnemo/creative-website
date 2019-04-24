import { Component } from '@angular/core';
import { CreateFormDailogBody } from '@pages/shared/preview-dialog/dailog-bodys/create_form_dailog_body';
import { PreviewDialogService } from '@pages/shared';

@Component({
  selector: 'disruption-form-roadmaps-body',
  styleUrls: ['./disruption-form-roadmaps-dialog.component.scss'],
  templateUrl: './disruption-form-roadmaps-dialog.component.html',
})
export class DisruptionFormRoadmapsDialogComponent extends CreateFormDailogBody {

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  protected initDocument(res: any) {
  }

}
