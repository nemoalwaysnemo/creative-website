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

  triggerEvent(event: SelectableItemEvent): this {
    this.event.next(event);
    return this;
  }

  onEvent(dataType?: string): Observable<SelectableItemEvent> {
    return (dataType ? this.event.pipe(filter((e: SelectableItemEvent) => e.type === dataType)) : this.event).pipe(share());
  }

  change(event: SelectableItemEvent): void {
    if (event.selected) {
      this.selectedItems[event.doc.uid] = event.component;
    } else {
      delete this.selectedItems[event.doc.uid];
    }
    event.collection = Object.values(this.selectedItems).map((i: any) => i.document);
    this.triggerEvent(event);
  }

  clear(): void {
    Object.values(this.selectedItems).forEach((c: any) => c.onChecked(false));
    this.selectedItems = {};
  }

}
