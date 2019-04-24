import { BaseDialogBody } from '../base-dialog-body';
import { PreviewDialogService } from '../preview-dialog.service';
import { Output, EventEmitter } from '@angular/core';

export abstract class CreateFormDailogBody extends BaseDialogBody {

  @Output() createdSuccess: EventEmitter<any> = new EventEmitter();

  constructor(protected dialogService: PreviewDialogService) {
    super(dialogService);
  }

  showSuccessMessage(message: string): void {
    this.dialogService.showAlert('success', message, 3000);
  }

  showErrorMessage(message: string): void {
    this.dialogService.showAlert('danger', message);
  }

  onCreated(docs: any): void {
    this.createdSuccess.next(docs);
    this.showSuccessMessage(`${docs[0].title} create success`);
  }


}
