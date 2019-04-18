import { Component } from '@angular/core';
import { BaseDialogBody } from '@pages/shared/preview-dialog/base-dialog-body';
import { PreviewDialogService } from '@pages/shared';

@Component({
  selector: 'tbwa-disruption-form-roadmaps-body',
  styleUrls: ['./disruption-form-roadmaps-dialog.component.scss'],
  templateUrl: './disruption-form-roadmaps-dialog.component.html',
})
export class DisruptionFormRoadmapsDialogComponent extends BaseDialogBody {

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  protected initDocument(res: any) {
  }

}
