import { Component } from '@angular/core';
import { FormDailogBodyComponent } from '@pages/shared/preview-dialog/dailog-bodys/form_dailog_body-component';
import { PreviewDialogService } from '../../../preview-dialog';

@Component({
  selector: 'disruption-thinking-edit-dialog-body',
  styleUrls: ['./disruption-thinking-edit-dialog-body.component.scss'],
  templateUrl: './disruption-thinking-edit-dialog-body.component.html',
})
export class DisruptionThinkingEditDialogComponent extends FormDailogBodyComponent {

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
    // this.callback.next({ type: 'success', value: doc });
    this.dialogService.delayed(this.updatedSuccess, doc);
  }

  back(): void {
    // this.callback.next({ type: 'back', value: 'preview' });
  }

}
