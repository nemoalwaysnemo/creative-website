import { Component } from '@angular/core';
import { FormDailogBodyComponent } from '@pages/shared/preview-dialog/dailog-bodys/form_dailog_body-component';
import { PreviewDialogService } from '../../../preview-dialog';
import { DocumentViewService } from '@pages/shared/services/document-view.service';

@Component({
  selector: 'disruption-roadmap-edit-dialog-body',
  styleUrls: ['./disruption-roadmap-edit-dialog-body.component.scss'],
  templateUrl: './disruption-roadmap-edit-dialog-body.component.html',
})
export class DisruptionRoadmapEditDialogComponent extends FormDailogBodyComponent {

  title: string;

  constructor(protected dialogService: PreviewDialogService, private documentViewService: DocumentViewService) {
    super(dialogService);
  }

  mode: 'create' | 'edit' = 'edit';

  protected initDocument(res: any) {
    this.title = res.options.title;
  }

  onUpdated(doc: any): void {
    this.showMessage('success' , `${doc.title} update success`);
    // this.callback.next({type: 'success', value: doc});
    this.dialogService.delayed(this.updatedSuccess, doc);
  }

  back(): void {
    // this.callback.next({type: 'back', value: 'preview'});
  }

}
