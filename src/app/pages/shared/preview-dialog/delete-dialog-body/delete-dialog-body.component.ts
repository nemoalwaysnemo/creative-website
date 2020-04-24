import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { PreviewDialogService } from '../preview-dialog.service';
import { BaseDialogBodyComponent } from '../base-dialog-body-component';
import { Observable, of as observableOf } from 'rxjs';
import { DocumentModel } from '@core/api';
import { DocumentViewService } from '@pages/shared/services/document-view.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'delete-dialog-body',
  styleUrls: ['./delete-dialog-body.component.scss'],
  templateUrl: './delete-dialog-body.component.html',
})

export class DeleteDialogBodyComponent extends BaseDialogBodyComponent implements OnInit {
  constructor(protected dialogService: PreviewDialogService,
              private documentViewService: DocumentViewService,
              private router: Router,
              private location: Location) {
                super(dialogService);
  }
  @Input() backButton: boolean;
  @Input() deleteRedirect: string;
  @Input() isSoftDel: boolean = false;
  @Output() onDeleted: EventEmitter<DocumentModel> = new EventEmitter<DocumentModel>();

  protected initDocument() { }

  onDelete($event: any): void {
    if (this.isSoftDel) {
      this.move();
    } else {
      this.delete();
    }
  }

  private delete(): void {
    this.deleteDocument(this.document).subscribe((model: DocumentModel) => {
      this.deleteDialog();
    });
  }

  private deleteDocument(model: DocumentModel): Observable<DocumentModel> {
    return model.delete();
  }

  private move(): void {
    this.moveDocument(this.document).subscribe((model: DocumentModel) => {
      this.deleteDialog();
    });
  }

  private moveDocument(model: DocumentModel): Observable<DocumentModel> {
    return model.moveToTrash();
  }

  private deleteDialog(): void {
    this.dialogService.closeWithAlert('success', `${this.document.title} deleted success`, 3000);
    if (this.deleteRedirect === '') {
      this.location.back();
    } else {
      this.router.navigateByUrl(this.deleteRedirect);
    }
  }

  back(): void {
    if (this.backButton) {
      // this.callback.next({ type: 'back', value: 'preview' });
    } else {
      this.close();
    }
  }
}
