import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DocumentViewService {

  private document$ = new Subject<{ uid: string }>();

  onDeletedDoc(): Observable<{ uid: string }> {
    return this.document$.pipe(share());
  }

  hideDeletedDoc(uid?: string) {
    this.document$.next({ uid: uid });
  }
}
