import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { PreviewDialogService } from '../preview-dialog.service';
import { BaseDialogBody } from '../base-dialog-body';

@Component({
  selector: 'tbwa-roadmaps-dialog',
  styleUrls: ['./roadmaps-dialog.component.scss'],
  templateUrl: './roadmaps-dialog.component.html',
})
export class RoadmapsDialogComponent extends BaseDialogBody {
  private title: string = '';

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  protected initDocument(res: any) {
    this.title = res.options.title;
  }

}
