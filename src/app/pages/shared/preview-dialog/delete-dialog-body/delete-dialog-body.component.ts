import { ChangeDetectionStrategy, Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { PreviewDialogService } from '../preview-dialog.service';
import { Subject } from 'rxjs';
import { BaseDialogBody } from '../base-dialog-body';
import { Observable, of as observableOf } from 'rxjs';
import { NuxeoPermission } from '@core/api';
import { DocumentModel, DocumentRepository, NuxeoUploadResponse } from '@core/api';
import { deepExtend } from '@core/services';
import { DocumentViewService } from '@pages/shared/services/document-view.service';

@Component({
  selector: 'delete-dialog-body',
  styleUrls: ['./delete-dialog-body.component.scss'],
//   changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './delete-dialog-body.component.html',
})

export class DeleteDialogBodyComponent extends BaseDialogBody implements OnInit {

  constructor(protected dialogService: PreviewDialogService, private documentViewService: DocumentViewService) {
    super(dialogService);
  }
  @Input() document: DocumentModel;
  private documentModel: DocumentModel;

  title: string;

  writePermission$: Observable<boolean>;

  private uploadFieldName: string;

  @Input() moreInfo: boolean = false;

  @Input() editButton: boolean = false;

  @Output() onDeleted: EventEmitter<DocumentModel> = new EventEmitter<DocumentModel>();

  switch: Subject<boolean> = new Subject<boolean>();
  status: string = 'success';
  message: string = 'You have been successfully authenticated!';

  ngOnInit() {
    this.onAlertNext();
  }

  protected initDocument(res: any) {
    this.title = res.options.title;
    if (this.editButton) {
      this.writePermission$ = this.document.hasPermission(NuxeoPermission.Write);
    } else {
      this.writePermission$ = observableOf(false);
    }
  }

  private onAlertNext(): void {
    this.dialogService.onAlertNext().subscribe((option: { switch: boolean, status?: string, message?: string }) => {
      if (option.switch) {
        this.status = option.status;
        this.message = option.message;
      }
      this.switch.next(option.switch);
    });
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
      this.dialogService.closeWithAlert('success' , `${this.document.title} deleted success`, 3000);
      this.documentViewService.hideDeletedDoc(this.document.uid);
    });
  }

  private deleteDocument(model: DocumentModel, properties: any = {}): Observable<DocumentModel> {
    return model.set(properties).delete();
  }

  closeAlert() {
    this.switch.next(false);
  }

  back(): void {
    this.callBack.next({type: 'back', value: 'preview'});
  }
}
