import { BaseDialogBody } from '../base-dialog-body';
import { PreviewDialogService } from '../preview-dialog.service';
import { Output, EventEmitter } from '@angular/core';

export abstract class FormDailogBody extends BaseDialogBody {

  @Output() createdSuccess: EventEmitter<any> = new EventEmitter();
  @Output() updatedSuccess: EventEmitter<any> = new EventEmitter();

  abstract mode: 'create' | 'edit';

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  showSuccessMessage(message: string): void {
    this.dialogService.closeWithAlert('success', message, 3000);
  }

  showErrorMessage(message: string): void {
    this.dialogService.closeWithAlert('danger', message);
  }

  onCreated(docs: any): void {
    this.createdSuccess.next(docs);
    this.showSuccessMessage(`${docs[0].title} create success`);
  }

  onUpdated(doc: any): void {
    this.updatedSuccess.next(doc);
    this.showSuccessMessage(`${doc.title} update success`);
  }

}
