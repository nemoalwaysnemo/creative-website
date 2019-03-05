import { Injectable, TemplateRef } from '@angular/core';
import { NbDialogService } from '@core/nebular/theme';
import { PreviewDialogComponent } from './preview-dialog.component';
import { Subject, Observable, ReplaySubject } from 'rxjs';
import { share } from 'rxjs/operators';
import { DocumentModel } from '@core/api';

@Injectable()
export class PreviewDialogService {
  private ref: any;
  private docment$: ReplaySubject<{ doc: DocumentModel, type: string }> = new ReplaySubject<{ doc: DocumentModel, type: string }>();

  constructor(private dialogService: NbDialogService) { }

  open(dialog: any, doc: DocumentModel, type: string): void {
    this.ref = this.dialogService.open(dialog);
    this.docment$.next({ doc, type });
  }

  close(): void {
    this.ref.close();
  }

  onDocmentNext(): Observable<any> {
    return this.docment$.pipe(share());
  }
}
