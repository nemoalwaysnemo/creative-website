import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { PreviewDialogService } from '../preview-dialog.service';
import { BaseDialogBody } from '../base-dialog-body';
import { Observable, of as observableOf } from 'rxjs';
import { NuxeoPermission } from '@core/api';
import { DocumentModel } from '@core/api';
import { deepExtend } from '@core/services';
import { DocumentViewService } from '@pages/shared/services/document-view.service';

@Component({
  selector: 'delete-dialog-body',
  styleUrls: ['./delete-dialog-body.component.scss'],
  templateUrl: './delete-dialog-body.component.html',
})

export class DeleteDialogBodyComponent extends BaseDialogBody implements OnInit {

  constructor(protected dialogService: PreviewDialogService, private documentViewService: DocumentViewService) {
    super(dialogService);
  }
  @Input() document: DocumentModel;

  title: string;

  writePermission$: Observable<boolean>;

  private uploadFieldName: string;


  @Input() editButton: boolean = false;

  @Output() onDeleted: EventEmitter<DocumentModel> = new EventEmitter<DocumentModel>();

  protected initDocument(res: any) {
    this.title = res.options.title;
    if (this.editButton) {
      this.writePermission$ = this.document.hasPermission(NuxeoPermission.Write);
    } else {
      this.writePermission$ = observableOf(false);
    }
  }

  onDelete($event: any): void {
    this.delete();
  }

  private filterPropertie(formValue: any = {}) {
    const properties = deepExtend({}, formValue);
    if (this.uploadFieldName && properties[this.uploadFieldName]) {
      delete properties[this.uploadFieldName];
    }
    return properties;
  }

  private delete(): void {
    const properties = this.filterPropertie('');
    this.deleteDocument(this.document, properties).subscribe((model: DocumentModel) => {
      this.dialogService.closeWithAlert('success', `${this.document.title} deleted success`, 3000);
      this.documentViewService.hideDeletedDoc(this.document.uid);
    });
  }

  private deleteDocument(model: DocumentModel, properties: any = {}): Observable<DocumentModel> {
    return model.set(properties).delete();
  }

  back(): void {
    this.callBack.next({ type: 'back', value: 'preview' });
  }
}
