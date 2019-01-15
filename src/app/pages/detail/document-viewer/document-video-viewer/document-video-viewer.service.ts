import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class DocumentVideoViewerService {
  private timePlaying = new Subject<{ time: number }>();

  getTimeChanged(): Observable<any> {
    return this.timePlaying.asObservable();
  }

  setTime(time: any) {
    this.timePlaying.next({ time: time });
  }
}
