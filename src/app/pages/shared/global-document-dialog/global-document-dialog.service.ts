import { Injectable, TemplateRef, Type } from '@angular/core';
import { NbDialogService } from '@core/nebular/theme';
import { Observable, Subject, timer } from 'rxjs';
import { share, filter, map } from 'rxjs/operators';
import { GoogleAnalyticsService } from '@core/services';
import { DocumentModel } from '@core/api';

export class DocumentDialogEvent {
  readonly name: string;
  readonly message?: string;
  readonly doc?: DocumentModel;
  readonly options?: DocumentDialogOption = {};
}

export interface DocumentDialogOption {
  [key: string]: any;
  component?: any;
  metadata?: any;
  view?: string;
}

@Injectable({
  providedIn: 'root',
})
export class GlobalDocumentDialogService {

  private event: Subject<DocumentDialogEvent> = new Subject<DocumentDialogEvent>();

  private options: DocumentDialogOption = {};

  constructor(private dialogService: NbDialogService, private googleAnalyticsService: GoogleAnalyticsService) {

  }

  open(dialog: TemplateRef<any>, options: DocumentDialogOption = {}): void {
    this.options = options;
    this.dialogService.open(dialog);
    // this.googleAnalyticsService.eventTrack({ 'event_category': 'PopupPreview', 'event_action': 'Open', 'event_label': 'Open', 'dimensions.docId': doc.uid });
  }

  close(): void {
    this.dialogService.close();
  }

  onOpen(): Observable<DocumentDialogEvent> {
    return this.dialogService.onOpen().pipe(
      map(_ => ({ name: 'Opened', message: 'Opened', options: this.options })),
      share(),
    );
  }

  onClose(): Observable<any> {
    return this.dialogService.onClose().pipe(
      map(_ => ({ name: 'Closed', message: 'Closed', options: this.options })),
      share(),
    );
  }

  onEvent(name?: string): Observable<DocumentDialogEvent> {
    return (name ? this.event.pipe(filter((e: DocumentDialogEvent) => e.name === name)) : this.event).pipe(share());
  }

  triggerEvent(event: DocumentDialogEvent): this {
    this.event.next(event);
    return this;
  }

  selectView(name: string, component: Type<any> = null, metadata: any = {}): void {
    this.triggerEvent({ name: 'ViewChanged', message: 'View Changed', options: { view: name, component, metadata } });
  }

  setDocument(doc: DocumentModel, options: any = {}): this {
    this.triggerEvent({ name: 'DocumentChanged', message: 'Document Changed', doc, options });
    return this;
  }

  onDocumentChanged(): Observable<DocumentDialogEvent> {
    return this.event.pipe(
      filter((e: DocumentDialogEvent) => e.name === 'DocumentChanged'),
      share(),
    );
  }

  delayed(sub?: Subject<any>, message?: any, second: number = 3000): void {
    timer(second).subscribe(_ => sub.next(message));
  }
}
