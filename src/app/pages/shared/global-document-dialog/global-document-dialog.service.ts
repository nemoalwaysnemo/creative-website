import { Injectable, TemplateRef } from '@angular/core';
import { NbDialogService } from '@core/nebular/theme';
import { Observable, Subject, timer } from 'rxjs';
import { share, filter } from 'rxjs/operators';
import { GoogleAnalyticsService } from '@core/services';
import { DocumentModel } from '@core/api';

export class DocumentDialogEvent {
  readonly name: string;
  readonly message?: string;
  readonly doc?: DocumentModel;
  readonly options?: any = {};
}

@Injectable({
  providedIn: 'root',
})
export class GlobalDocumentDialogService {

  private event: Subject<DocumentDialogEvent> = new Subject<DocumentDialogEvent>();

  private options: any = {};

  constructor(private dialogService: NbDialogService, private googleAnalyticsService: GoogleAnalyticsService) {

  }

  onEvent(name?: string): Observable<DocumentDialogEvent> {
    return (name ? this.event.pipe(filter((e: DocumentDialogEvent) => e.name === name)) : this.event).pipe(share());
  }

  triggerEvent(event: DocumentDialogEvent): this {
    this.event.next(event);
    return this;
  }

  open(dialog: TemplateRef<any>, options: any = {}): void {
    this.options = options;
    this.dialogService.open(dialog);
    this.triggerEvent({ name: 'open', message: 'Open' });
    // this.googleAnalyticsService.eventTrack({ 'event_category': 'PopupPreview', 'event_action': 'Open', 'event_label': 'Open', 'dimensions.docId': doc.uid });
  }

  onOpen(): Observable<DocumentDialogEvent> {
    return this.dialogService.onOpen();
  }

  close(): void {
    this.dialogService.close();
  }

  onClose(): Observable<any> {
    return this.dialogService.onClose();
  }

  selectView(name: string): void {
    this.triggerEvent({ name: 'viewChanged', message: 'View Changed', options: { view: name } });
  }

  setDocument(doc: DocumentModel, options: any = {}): this {
    this.triggerEvent({ name: 'documentChanged', message: 'Document Changed', doc, options });
    return this;
  }

  onDocumentChanged(): Observable<DocumentDialogEvent> {
    return this.event.pipe(
      filter((e: DocumentDialogEvent) => e.name === 'documentChanged'),
      share(),
    );
  }

  delayed(sub?: Subject<any>, message?: any, second: number = 3000): void {
    timer(second).subscribe(_ => sub.next(message));
  }
}
