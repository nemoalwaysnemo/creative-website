import { Injectable, TemplateRef } from '@angular/core';
import { NbDialogService } from '@core/nebular/theme';
import { Observable, ReplaySubject } from 'rxjs';
import { share } from 'rxjs/operators';
import { DocumentModel } from '@core/api';

@Injectable()
export class PreviewDialogService {

  private ref: any;

  private document$: ReplaySubject<{ doc: DocumentModel, options: any }> = new ReplaySubject<{ doc: DocumentModel, type: string, options: any }>();

  constructor(private dialogService: NbDialogService) { }

  open(dialog: TemplateRef<any>, doc: DocumentModel, options: any = {}): void {
    this.ref = this.dialogService.open(dialog);
    this.document$.next({ doc, options });
  }

  close(): void {
    this.ref.close();
  }

  onDocmentNext(): Observable<any> {
    return this.document$.pipe(share());
  }
}
