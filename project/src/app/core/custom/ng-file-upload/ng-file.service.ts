import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, share } from 'rxjs/operators';

export class NgFileEvent {
  [key: string]: any;
  readonly name: string;
  readonly type: string;
  readonly data: any = {};

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}

@Injectable({
  providedIn: 'root',
})
export class NgFileService {

  private event$: Subject<NgFileEvent> = new Subject<NgFileEvent>();

  onEvent(name?: string | string[]): Observable<NgFileEvent> {
    return this.event$.pipe(filter((e: NgFileEvent) => name ? (Array.isArray(name) ? name : [name]).includes(e.name) : true)).pipe(share());
  }

  onEventType(type?: string | string[]): Observable<NgFileEvent> {
    return this.event$.pipe(filter((e: NgFileEvent) => type ? (Array.isArray(type) ? type : [type]).includes(e.type) : true)).pipe(share());
  }

  triggerEvent(event: NgFileEvent): void {
    this.event$.next(event);
  }

}
