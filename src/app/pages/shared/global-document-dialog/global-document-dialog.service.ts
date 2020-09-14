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
  componentName?: string;
  component?: any;
  metadata?: any;
}

@Injectable({
  providedIn: 'root',
})
export class GlobalDocumentDialogService {

  private event: Subject<DocumentDialogEvent> = new Subject<DocumentDialogEvent>();

  private options: DocumentDialogOption = {};

  private params: any = {};

  constructor(private dialogService: NbDialogService) {

  }

  open(dialog: TemplateRef<any>, options: DocumentDialogOption = {}, params: any = {}): void {
    this.options = options;
    this.params = params;
    this.dialogService.open(dialog);
  }

  close(): void {
    this.dialogService.close();
  }

  getParams(): any {
    return this.params;
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

  onEventName(name?: string): Observable<DocumentDialogEvent> {
    return this.event.pipe(filter((e: DocumentDialogEvent) => name ? e.name === name : true)).pipe(share());
  }

  onEventType(type: string): Observable<DocumentDialogEvent> {
    return this.event.pipe(filter((e: DocumentDialogEvent) => e.type === type)).pipe(share());
  }

  triggerEvent(event: DocumentDialogEvent): this {
    this.event.next(event);
    return this;
  }

  selectView(componentName: string, component: Type<any> = null, metadata?: any): void {
    this.triggerEvent({ name: 'ViewChanged', type: 'built-in', messageContent: 'View Changed', options: { componentName, component, metadata } });
  }

}
