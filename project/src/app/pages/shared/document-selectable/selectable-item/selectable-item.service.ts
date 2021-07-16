import { Injectable, ComponentRef } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter, share } from 'rxjs/operators';
import { DocumentModel } from '@core/api';

export class SelectableItemEvent {
  readonly doc: DocumentModel;
  readonly type: string;
  readonly selected: boolean; // added or removed
  readonly component: ComponentRef<any>;
  collection: DocumentModel[];

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}

@Injectable({
  providedIn: 'root',
})
export class SelectableItemService {

  private selectedItems: { [key: string]: ComponentRef<any> } = {};

  private event = new Subject<SelectableItemEvent>();

  private queueLimit: { [key: string]: number } = {};

  triggerEvent(event: SelectableItemEvent): this {
    this.event.next(event);
    return this;
  }

  onEvent(dataType?: string): Observable<SelectableItemEvent> {
    return this.event.pipe(filter((e: SelectableItemEvent) => dataType ? e.type === dataType : true)).pipe(share());
  }

  change(event: SelectableItemEvent): void {
    if (event.selected) {
      this.selectedItems[event.doc.uid] = event.component;
      if (this.queueLimit[event.type] > 0) {
        const currentSelectedIds: string[] = this.getSelectedIds(event);
        if ( currentSelectedIds.length - this.queueLimit[event.type] > 0 ) {
          Object.values(this.selectedItems).filter((i: any) => i.document.uid === currentSelectedIds[0]).map((i: any) => i.onChecked(false));
          delete this.selectedItems[currentSelectedIds[0]];
        }
      }
    } else {
      delete this.selectedItems[event.doc.uid];
    }
    event.collection = Object.values(this.selectedItems).filter((i: any) => i.dataType === event.type).map((i: any) => i.document);
    this.triggerEvent(event);
  }

  clear(type?: string): void {
    if (type) {
      Object.values(this.selectedItems).filter((i: any) => i.dataType === type).map((i: any) => {
        i.onChecked(false);
        delete this.selectedItems[i.document.uid];
      });
    } else {
      Object.values(this.selectedItems).forEach((c: any) => c.onChecked(false));
      this.selectedItems = {};
    }
  }

  getSelectedIds(event: SelectableItemEvent): string[] {
    return Object.values(this.selectedItems).filter((i: any) => i.dataType === event.type).map((i: any) => i.document.uid);
  }

  setQueueLimit(type: string, num: number): void {
    this.queueLimit[type] = num;
  }
}
