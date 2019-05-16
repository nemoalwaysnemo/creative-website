import { Component } from '@angular/core';
import { FormDailogBody } from '@pages/shared/preview-dialog/dailog-bodys/form_dailog_body';
import { PreviewDialogService } from '@pages/shared';

@Component({
  selector: 'disruption-form-body',
  styleUrls: ['./disruption-form-dialog.component.scss'],
  templateUrl: './disruption-form-dialog.component.html',
})
export class DisruptionFormDialogComponent extends FormDailogBody {

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  mode: 'create' | 'edit' = 'create';

  protected initDocument(res: any) {
  }

  onCreated(docs: any[]): void {
    this.showSuccessMessage(`${docs[0].title} has been created successfully!`);
    this.dialogService.delayed(this.createdSuccess, docs, 2000);
  }

}
