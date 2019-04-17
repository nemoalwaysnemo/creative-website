import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { BaseDialogBody } from '@pages/shared/preview-dialog/base-dialog-body';
import { PreviewDialogService } from '@pages/shared';

@Component({
  selector: 'tbwa-roadmaps-body',
  styleUrls: ['./roadmaps-dialog.component.scss'],
  templateUrl: './roadmaps-dialog.component.html',
})
export class RoadmapsDialogComponent extends BaseDialogBody {
  title: string = '';

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  protected initDocument(res: any) {
    this.title = res.options.title;
  }

}
