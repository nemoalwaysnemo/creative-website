import { Component } from '@angular/core';
import { DocumentModel } from '@core/api';
import { BaseDocumentViewComponent, DocumentPageService } from '@pages/shared';
import { DocumentFormEvent, DocumentFormStatus } from '../../shared/document-form/document-form.interface';

@Component({
  selector: 'backslash-trigger-preference',
  styleUrls: ['./backslash-trigger-preference.component.scss'],
  templateUrl: './backslash-trigger-preference.component.html',
})
export class BackslashTriggerPreferenceComponent extends BaseDocumentViewComponent {

  document: DocumentModel = new DocumentModel();

  showErrors: boolean = false;

  formSettings: any = {
    enableLayoutRight: false,
    buttonGroup: [
      {
        label: 'SAVE',
        name: 'user-preference',
        type: 'custom',
        disabled: (status: DocumentFormStatus) => status.disableSaveButton(),
      },
    ],
  };

  constructor(
    protected documentPageService: DocumentPageService,
  ) {
    super(documentPageService);
  }

  onCallback(e: DocumentFormEvent): void {
    if (['Created', 'Updated'].includes(e.action)) {
      this.documentPageService.notify(`User preference has been updated successfully!`, '', 'success');
    }

  }

}
