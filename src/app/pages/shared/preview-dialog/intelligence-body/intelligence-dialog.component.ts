import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { PreviewDialogService } from '../preview-dialog.service';
import { BaseDialogBody } from '../base-dialog-body';

@Component({
  selector: 'tbwa-intelligence-dialog',
  styleUrls: ['./intelligence-dialog.component.scss'],
  templateUrl: './intelligence-dialog.component.html',
})
export class IntelligenceDialogComponent extends BaseDialogBody {

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  protected initDocument(res: any) {
    this.document = res.doc;
  }

}
