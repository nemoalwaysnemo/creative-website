import { Component, Input, TemplateRef } from '@angular/core';
import { DocumentModel } from '@core/api';
import { objHasValue } from '@core/services/helpers';
import { GlobalDocumentDialogService } from '../global-document-dialog/global-document-dialog.service';
import { GlobalDocumentDialogSettings } from '../global-document-dialog/global-document-dialog.interface';

export class ListSearchResultRowButtonSettings {

  dialogTitle: string = ':docTitle';

  dialogSettings: GlobalDocumentDialogSettings;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}

@Component({
  template: `
    <button type="button" (click)="openDialog(dialog)" class="icon_btn">Detail</button>
    <ng-template #dialog>
      <global-document-dialog [settings]="metadata.dialogSettings" [documentModel]="value" [title]="getTitle(value)"></global-document-dialog>
    </ng-template>
  `,
})
export class ListSearchResultRowButtonDialogComponent {

  metadata: ListSearchResultRowButtonSettings;

  @Input() value: DocumentModel;

  @Input()
  set settings(settings: ListSearchResultRowButtonSettings) {
    if (objHasValue(settings)) {
      this.metadata = settings;
    }
  }

  constructor(protected globalDocumentDialogService: GlobalDocumentDialogService) {

  }

  getTitle(doc: DocumentModel): string {
    return this.metadata.dialogTitle.replace(':docTitle', doc.title);
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }
}
