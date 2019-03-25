import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { PreviewDialogService } from '../../preview-dialog/preview-dialog.service';
import { BaseDialogBody } from '../../preview-dialog/base-dialog-body';

@Component({
  selector: 'tbwa-backslash-dialog-body',
  styleUrls: ['./backslash-dialog.component.scss'],
  templateUrl: './backslash-dialog.component.html',
})
export class BackslashDialogComponent extends BaseDialogBody {

  private description: string;

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  protected initDocument(res: any) {
    this.description = res.doc.get('dc:description');
  }

}
