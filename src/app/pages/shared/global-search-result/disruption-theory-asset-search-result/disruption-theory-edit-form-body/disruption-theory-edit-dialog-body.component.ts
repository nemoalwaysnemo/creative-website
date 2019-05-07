import { Component } from '@angular/core';
import { FormDailogBody } from '@pages/shared/preview-dialog/dailog-bodys/form_dailog_body';
import { PreviewDialogService } from '../../../preview-dialog';

@Component({
  selector: 'disruption-theory-edit-dialog-body',
  styleUrls: ['./disruption-theory-edit-dialog-body.component.scss'],
  templateUrl: './disruption-theory-edit-dialog-body.component.html',
})
export class DisruptionTheoryEditDialogComponent extends FormDailogBody {

  title: string;

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  mode: 'create' | 'edit' = 'edit';

  protected initDocument(res: any) {
    this.title = res.options.title;
  }

  onUpdated(doc: any): void {
    this.showMessage('success', `${doc.title} update success`);
    this.callBack.next(doc);
    this.dialogService.delayed(this.updatedSuccess, doc);
  }

}
