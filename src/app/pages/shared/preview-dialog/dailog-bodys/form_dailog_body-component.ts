import { Output, EventEmitter } from '@angular/core';
import { BaseDialogBodyComponent } from '../base-dialog-body-component';
import { PreviewDialogService } from '../preview-dialog.service';

export abstract class FormDailogBodyComponent extends BaseDialogBodyComponent {

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
    this.showSuccessMessage(`${docs[0].title} has been created successfully!`);
  }

  onUpdated(doc: any): void {
    this.updatedSuccess.next(doc);
    this.showSuccessMessage(`${doc.title} has been updated successfully!`);
  }

  showMessage(status?: string, message?: string): void {
    this.dialogService.alert(status, message);
  }

}
