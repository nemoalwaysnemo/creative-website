import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { PreviewDialogService } from '../preview-dialog.service';
import { BaseDialogBody } from '../base-dialog-body';

@Component({
  selector: 'tbwa-disruption-dialog',
  styleUrls: ['./disruption-dialog.component.scss'],
  templateUrl: './disruption-dialog.component.html',
})
export class DisruptionDialogComponent extends BaseDialogBody {

  private description: string;

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  protected initDocument(res: any) {
    this.document = res.doc;
    this.description = res.doc.get('dc:description');
  }

}
