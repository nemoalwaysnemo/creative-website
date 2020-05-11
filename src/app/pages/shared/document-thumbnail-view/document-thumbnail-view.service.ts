import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter, share } from 'rxjs/operators';

export class DocumentThumbnailViewEvent {
  readonly name: string;
  readonly payload?: any;
  readonly message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DocumentThumbnailViewService {

  private event = new Subject<DocumentThumbnailViewEvent>();

  triggerEvent(event: DocumentThumbnailViewEvent): this {
    this.event.next(event);
    return this;
  }

  onEvent(name?: string): Observable<DocumentThumbnailViewEvent> {
    return (name ? this.event.pipe(filter((e: DocumentThumbnailViewEvent) => e.name === name)) : this.event).pipe(share());
  }

}
