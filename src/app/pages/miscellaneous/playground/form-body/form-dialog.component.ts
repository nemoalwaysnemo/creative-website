import { Component } from '@angular/core';
import { BaseDialogBodyComponent } from '@pages/shared/preview-dialog/base-dialog-body-component';
import { PreviewDialogService } from '@pages/shared';

@Component({
  selector: 'form-body',
  styleUrls: ['./form-dialog.component.scss'],
  templateUrl: './form-dialog.component.html',
})
export class FormDialogComponent extends BaseDialogBodyComponent {

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  protected initDocument(res: any) {
  }

}
