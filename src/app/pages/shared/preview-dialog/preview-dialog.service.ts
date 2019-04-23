import { Injectable, TemplateRef } from '@angular/core';
import { NbDialogService } from '@core/nebular/theme';
import { Observable, ReplaySubject, Subject, interval, timer } from 'rxjs';
import { share, switchMap } from 'rxjs/operators';
import { DocumentModel } from '@core/api';

@Injectable()
export class PreviewDialogService {

  private ref: any;

  private document$: ReplaySubject<{ doc: DocumentModel, options: any }> = new ReplaySubject<{ doc: DocumentModel, type: string, options: any }>();

  private alertStatus$: Subject<{ switch: boolean, status?: string, message?: string }> = new Subject<{ switch: boolean, status?: string, message?: string } >();

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

  showAlert(status?: string, message?: string, second?: number): void {
    this.alertStatus$.next({ switch: true, status, message});
    if (second) {
      timer(second).subscribe(_ => this.close());
    }
  }

  hideAlert(): void {
    this.alertStatus$.next({switch: false});
  }

  onAlertNext(): Observable<any> {
    return this.alertStatus$.pipe(share());
  }

}
