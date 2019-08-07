import { Component } from '@angular/core';
import { FormDailogBody } from '@pages/shared/preview-dialog/dailog-bodys/form_dailog_body';
import { PreviewDialogService } from '@pages/shared';

@Component({
  selector: 'disruption-folder-edit-from-body',
  styleUrls: ['./disruption-folder-edit-from-dialog.component.scss'],
  templateUrl: './disruption-folder-edit-from-dialog.component.html',
})
export class DisruptionFormFolderEditDialogComponent extends FormDailogBody {

  type: string;

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  mode: 'create' | 'edit' = 'edit';

  protected initDocument(res: any) {
    this.type = res.options.type;
  }

  typeIs(type: string): boolean {
    switch (type) {
      case 'day':
        return this.type === 'App-Disruption-Day';
      case 'howtos':
        return this.type === 'App-Disruption-Theory-Folder';
      default:
        return false;
    }
  }

}
