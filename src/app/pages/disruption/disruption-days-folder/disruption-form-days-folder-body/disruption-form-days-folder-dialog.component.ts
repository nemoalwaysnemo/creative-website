import { Component } from '@angular/core';
import { FormDailogBody } from '@pages/shared/preview-dialog/dailog-bodys/form_dailog_body';
import { PreviewDialogService } from '@pages/shared';

@Component({
  selector: 'disruption-form-days-folder-body',
  styleUrls: ['./disruption-form-days-folder-dialog.component.scss'],
  templateUrl: './disruption-form-days-folder-dialog.component.html',
})
export class DisruptionFormDaysFolderDialogComponent extends FormDailogBody {

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  mode: 'create' | 'edit' = 'create';

  protected initDocument(res: any) {
  }

}
