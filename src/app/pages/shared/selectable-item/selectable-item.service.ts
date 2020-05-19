import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter, share } from 'rxjs/operators';
import { DocumentModel } from '@core/api';

export class SelectableItemEvent {
  readonly doc: DocumentModel;
  readonly type: string;
  readonly selected: boolean; // added or removed
  collection: DocumentModel[];

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}

@Injectable({
  providedIn: 'root',
})
export class SelectableItemService {

  private documents: DocumentModel[] = [];

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
      this.documents.push(event.doc);
    } else {
      this.documents.splice(this.documents.findIndex((d: DocumentModel) => d.uid === event.doc.uid), 1);
    }
    event.collection = this.documents;
    this.triggerEvent(event);
  }

  clear(): void {
    this.documents = [];
  }

}
