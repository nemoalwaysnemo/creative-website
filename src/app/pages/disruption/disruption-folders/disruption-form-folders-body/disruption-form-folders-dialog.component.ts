import { Component } from '@angular/core';
import { CreateFormDailogBody } from '@pages/shared/preview-dialog/dailog-bodys/create_form_dailog_body';
import { PreviewDialogService } from '@pages/shared';

@Component({
  selector: 'disruption-form-folders-body',
  styleUrls: ['./disruption-form-folders-dialog.component.scss'],
  templateUrl: './disruption-form-folders-dialog.component.html',
})
export class DisruptionFormFoldersDialogComponent extends CreateFormDailogBody {

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  protected initDocument(res: any) {
  }

}
