import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CookieService } from '@core/services';
import { SearchQueryParamsService } from '../../services/search-query-params.service';
import { filter, share } from 'rxjs/operators';
import { DocumentModel } from '@core/api';

export class DocumentVideoEvent {
  [key: string]: any;
  readonly name: string;
  readonly document?: DocumentModel;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}

@Injectable()
export class DocumentVideoViewerService {

  private event: Subject<DocumentVideoEvent> = new Subject<DocumentVideoEvent>();

  constructor(private cookieService: CookieService, private queryParamsService: SearchQueryParamsService) {
  }

  getCookie(key: string): string {
    return this.cookieService.get(key);
  }

  setCookie(
    name: string,
    value: string,
    expires?: number | Date,
    path?: string,
    domain?: string,
    secure?: boolean,
    sameSite: 'Lax' | 'None' | 'Strict' = 'Lax',
  ): void {
    this.cookieService.set(name, value, expires, path, domain, secure, sameSite);
  }

  getQueryParams(key: string): string {
    return this.queryParamsService.getSnapshotQueryParams()[key];
  }

  onEvent(name?: string): Observable<DocumentVideoEvent> {
    return this.event.pipe(filter((e: DocumentVideoEvent) => name ? e.name === name : true)).pipe(share());
  }

  triggerEvent(event: DocumentVideoEvent): this {
    this.event.next(event);
    return this;
  }
}
