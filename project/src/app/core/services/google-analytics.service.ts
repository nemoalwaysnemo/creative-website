import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { ReplaySubject, Observable, of as observableOf } from 'rxjs';
import { map, tap, concatMap, filter } from 'rxjs/operators';
import { isDocumentUID, removeUselessObject } from '../services/helpers';
import { NuxeoAutomations } from '../api/nuxeo/lib/base.interface';
import { NuxeoApiService } from '../api/nuxeo/nuxeo.api.service';
import { NbAuthService } from '../base-auth/services';
import { Environment } from '@environment/environment';

declare let dataLayer: any;

export class GtmEvent {
  readonly [key: string]: any;
  readonly event: string;
  readonly event_category?: string;
  readonly event_action?: string;
  readonly event_label?: string;
  readonly page_location?: string;
  readonly page_path?: string;
  readonly page_title?: string;

  constructor(opts: any = {}) {
    Object.assign(this, opts);
  }
}

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {

  private userId: string;

  private event$ = new ReplaySubject<Partial<GtmEvent>>(10);

  constructor(
    private router: Router,
    private nuxeoApi: NuxeoApiService,
    private authService: NbAuthService,
  ) {
    // The dataLayer needs to be initialized
    if (typeof dataLayer !== 'undefined' && dataLayer) {
      dataLayer = (window as any).dataLayer = (window as any).dataLayer || [];
    }
    if (Environment.production) {
      this.startTracking();
    }
  }

  startTracking(): void {
    this.authService.isAuthenticated()
      .pipe(
        filter(authenticated => authenticated),
        concatMap(_ => this.getUserDigest()),
        concatMap(_ => this.event$),
      ).subscribe((event: GtmEvent) => {
        this.pushLayer(event);
      });
  }

  trackSearch(e: any = {}): void {
    const httpParams = new HttpParams({ fromObject: e.queryParams || {} });
    const queryParams = httpParams.toString();
    if (queryParams) {
      const url = this.router.url.split('?').shift() + '?' + queryParams;
      let event = Object.assign({}, e, {
        event: 'google-analytics-search',
        event_category: e.event_category || 'Search',
        event_action: e.event_action || 'Search',
        event_label: e.event_label || e.event_action,
        event_value: `${encodeURIComponent(url)}`,
      });
      event = removeUselessObject(event, ['queryParams']);
      event['dimensions.userEvent'] = 'Search';
      this.trackEvent(event);
      delete event['event'];
      this.trackEvent(event);
    }
  }

  trackEvent(e: any = {}): void {
    const event = Object.assign({}, {
      event: 'google-analytics-tracking',
      event_category: e.event_category || 'GA-Track',
      event_action: e.event_action,
      event_label: e.event_label,
      event_value: e.event_value,
    }, e);
    this.event$.next(event);
  }

  trackPageView(e: any = {}): void {
    const event = {
      event: 'google-analytics-pageview',
      page_location: (() => window.location).call(this),
      page_path: `${e.url}`,
      page_title: e.title,
    };
    if (e.doc) {
      event['dimensions.docId'] = e.doc.uid;
      event['dimensions.docTitle'] = e.doc.title;
    }
    event['dimensions.userEvent'] = 'Pageview';
    this.event$.next(event);
  }

  private pushLayer(layer: any = {}): void {
    if (typeof dataLayer !== 'undefined' && dataLayer) {
      layer = this.setDimensionModuleName(layer);
      layer = this.setDimensionUserId(layer);
      layer = this.setDimensionDocId(layer);
      layer = this.setDisplayedLabel(layer);
      dataLayer.push(layer);
    }
  }

  private getUserDigest(): Observable<string> {
    if (this.userId) {
      return observableOf(this.userId);
    } else {
      return this.nuxeoApi.operation(NuxeoAutomations.TBWAUserDigest).pipe(
        map(res => res.value),
        tap(userId => this.userId = userId),
      );
    }
  }

  private setDimensionDocId(event: any = {}): any {
    const docId = this.getPrimaryKey();
    if (!event['dimensions.docId'] && docId) {
      event['dimensions.docId'] = docId;
    }
    return event;
  }

  private setDimensionUserId(event: any = {}): any {
    if (this.userId) {
      event['dimensions.userId'] = this.userId;
    }
    return event;
  }

  private setDimensionModuleName(event: any = {}): any {
    const moduleName = this.getModuleName();
    if (!event['dimensions.moduleName']) {
      event['dimensions.moduleName'] = moduleName;
    }
    return event;
  }

  private setDisplayedLabel(event: any = {}): any {
    const moduleName = this.getModuleName();
    if (event['event_label']) {
      event['event_label'] = `${moduleName} | ${event['event_label']}`;
    }
    return event;
  }

  private getPrimaryKey(): string {
    const list = this.router.url.split('/').filter(x => isDocumentUID(x));
    return list.pop();
  }

  private getModuleName(): string {
    const list = this.router.url.split('/p/').pop().split('?').shift().split('/');
    let title = list[0] || '';
    if (list[0] === 'search') {
      title = `${list[0]} | ${list[1]} | ${list[2]}`;
    }
    return title;
  }

}
