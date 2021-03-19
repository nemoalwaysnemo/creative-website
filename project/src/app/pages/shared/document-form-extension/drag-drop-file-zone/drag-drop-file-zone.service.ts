import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { share, filter, map } from 'rxjs/operators';
import { DragDropFileZoneSettings } from './drag-drop-file-zone.interface';

@Injectable()
export class DragDropFileZoneService {

  private event$: Subject<any> = new Subject<any>();

  changeState(disabled: boolean, target?: string): void {
    this.event$.next({ data: disabled, event: 'stateChanged', target });
  }

  onStateChange(): Observable<any> {
    return this.filterEvents('stateChanged');
  }

  changeFiles(settings: DragDropFileZoneSettings, files: File[]): void {
    this.event$.next({ settings, data: files, event: 'fileChanged' });
  }

  onFilesChange(): Observable<{ settings: DragDropFileZoneSettings, data: File[] }> {
    return this.filterEvents('fileChanged');
  }

  private filterEvents(event: string): Observable<any> {
    return this.event$.pipe(
      filter((x: any) => x.event === event),
      map((x: any) => { delete x.event; return x; }),
      share(),
    );
  }
}
