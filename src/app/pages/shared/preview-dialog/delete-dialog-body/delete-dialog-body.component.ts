import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { PreviewDialogService } from '../preview-dialog.service';
import { BaseDialogBody } from '../base-dialog-body';
import { Observable, of as observableOf } from 'rxjs';
import { DocumentModel } from '@core/api';
import { DocumentViewService } from '@pages/shared/services/document-view.service';
import { Router } from '@angular/router';

@Component({
  selector: 'delete-dialog-body',
  styleUrls: ['./delete-dialog-body.component.scss'],
  templateUrl: './delete-dialog-body.component.html',
})

export class DeleteDialogBodyComponent extends BaseDialogBody implements OnInit {

  constructor(protected dialogService: PreviewDialogService, private documentViewService: DocumentViewService, private router: Router) {
    super(dialogService);
  }

  @Input() deleteRedirect: string;
  @Output() onDeleted: EventEmitter<DocumentModel> = new EventEmitter<DocumentModel>();

  protected initDocument() { }

  onDelete($event: any): void {
    this.delete();
  }

  private delete(): void {
    this.deleteDocument(this.document).subscribe((model: DocumentModel) => {
      this.dialogService.closeWithAlert('success', `${this.document.title} deleted success`, 3000);
      this.router.navigateByUrl(this.deleteRedirect);
    });
  }

  private deleteDocument(model: DocumentModel): Observable<DocumentModel> {
    return model.delete();
  }

  back(): void {
    this.callBack.next({ type: 'back', value: 'preview' });
  }
}
