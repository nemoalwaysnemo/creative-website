import { Injectable, TemplateRef, Type } from '@angular/core';
import { NbDialogService } from '@core/nebular/theme';
import { Observable, Subject } from 'rxjs';
import { share, filter, map } from 'rxjs/operators';
import { DocumentModel } from '@core/api';

export class DocumentDialogEvent {
  readonly name: string;
  readonly type: string;
  readonly messageType?: string;
  readonly messageTitle?: string;
  readonly messageContent?: string;
  readonly doc?: DocumentModel | DocumentModel[];
  readonly options?: DocumentDialogOption = {};
}

export interface DocumentDialogOption {
  [key: string]: any;
  closeOnBackdropClick?: boolean;
  componentName?: string;
  component?: any;
  metadata?: any;
}

@Injectable({
  providedIn: 'root',
})
export class GlobalDocumentDialogService {

  private event$: Subject<DocumentDialogEvent> = new Subject<DocumentDialogEvent>();

  private options: DocumentDialogOption = {};

  constructor(private dialogService: NbDialogService) {

  }

  open(dialog: TemplateRef<any>, options: DocumentDialogOption = {}): void {
    const closeOnBackdropClick = typeof options.closeOnBackdropClick === 'undefined' ? true : options.closeOnBackdropClick;
    delete options.closeOnBackdropClick;
    this.options = options;
    this.dialogService.open(dialog, { closeOnBackdropClick });
  }

  close(): void {
    this.triggerEvent({ name: 'Closed', type: 'built-in', messageContent: 'Closed' });
    this.dialogService.close();
  }

  onOpen(): Observable<DocumentDialogEvent> {
    return this.dialogService.onOpen().pipe(
      map(_ => ({ name: 'Opened', type: 'built-in', message: 'Opened', options: this.options })),
      share(),
    );
  }

  onClose(): Observable<DocumentDialogEvent> {
    return this.dialogService.onClose().pipe(
      map(_ => ({ name: 'Closed', type: 'built-in', message: 'Closed', options: this.options })),
      share(),
    );
  }

  onEvent(name?: string | string[]): Observable<DocumentDialogEvent> {
    return this.event$.pipe(filter((e: DocumentDialogEvent) => name ? (Array.isArray(name) ? name : [name]).includes(e.name) : true)).pipe(share());
  }

  onEventType(type?: string | string[]): Observable<DocumentDialogEvent> {
    return this.event$.pipe(filter((e: DocumentDialogEvent) => type ? (Array.isArray(type) ? type : [type]).includes(e.type) : true)).pipe(share());
  }

  triggerEvent(event: DocumentDialogEvent): this {
    this.event$.next(event);
    return this;
  }

  selectView(componentName: string, component: Type<any> = null, metadata?: any): void {
    this.triggerEvent({ name: 'ComponentChanged', type: 'built-in', messageContent: 'Component Changed', options: { componentName, component, metadata } });
  }

  refreshView(document: DocumentModel, metadata: any = {}): void {
    this.triggerEvent({ name: 'ViewChanged', type: 'built-in', messageContent: 'View Changed', options: { document, metadata } });
  }

}
