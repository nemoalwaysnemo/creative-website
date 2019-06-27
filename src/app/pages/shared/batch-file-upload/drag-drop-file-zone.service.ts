import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { share, filter, map } from 'rxjs/operators';

@Injectable()
export class DragDropFileZoneService {

  private event$ = new Subject<any>();

  changeState(target: string, disabled: boolean): void {
    this.event$.next({ data: disabled, event: 'state', target });
  }

  onStateChange(): Observable<any> {
    return this.filterEvents('state');
  }

  changeFiles(target: string, files: File[], queueLimit: number): void {
    this.event$.next({ data: files, event: 'files', target, queueLimit });
  }

  onFilesChange(): Observable<{ data: File[], target: string, queueLimit: number }> {
    return this.filterEvents('files');
  }

  private filterEvents(event: string): Observable<any> {
    return this.event$.pipe(
      filter((x: any) => x.event === event),
      map((x: any) => { delete x.event; return x; }),
      share(),
    );
  }
}
