import { Component } from '@angular/core';
import { FormDailogBody } from '@pages/shared/preview-dialog/dailog-bodys/form_dailog_body';
import { PreviewDialogService } from '@pages/shared';

@Component({
  selector: 'disruption-form-folders-body',
  styleUrls: ['./disruption-form-folders-dialog.component.scss'],
  templateUrl: './disruption-form-folders-dialog.component.html',
})
export class DisruptionFormFoldersDialogComponent extends FormDailogBody {

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  mode: 'create' | 'edit' = 'create';

  protected initDocument(res: any) {
  }

}
