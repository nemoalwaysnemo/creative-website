import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, share } from 'rxjs/operators';
import { DocumentListViewItem } from './document-list-view.interface';

export class RowSelectedMessage {
  data?: DocumentListViewItem;
  selected?: DocumentListViewItem[];
  source?: string;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}

@Injectable({
  providedIn: 'root',
})
export class DocumentListViewService {

  private rows$: Subject<RowSelectedMessage> = new Subject<RowSelectedMessage>();

  onRowSelect(row, settings): void {
    this.rows$.next(new RowSelectedMessage({ data: row.data, selected: row.selected, source: settings.source }));
  }

  onRowSelected(source?: string): Observable<any> {
    return this.rows$.pipe(filter((e: RowSelectedMessage) => source ? e.source === source : true)).pipe(share());
  }
}
