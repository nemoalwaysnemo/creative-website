import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { Subject, Observable, of as observableOf } from 'rxjs';
import { distinctUntilChanged, map, tap, concatMap, filter } from 'rxjs/operators';
import { removeUselessObject, isDocumentUID } from '../services/helpers';
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

  private event$: Subject<GtmEvent> = new Subject<GtmEvent>();

  constructor(
    private router: Router,
    private titleService: Title,
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

  pageViewTrack(): void {
    this.router.events.pipe(
      distinctUntilChanged(),
      filter(event => event instanceof NavigationEnd),
    ).subscribe((event: NavigationEnd) => {
      if (!(event.url.includes('q=') || event.url.includes('_agg='))) {
        this.trackPageView({ url: event.url, title: this.titleService.getTitle() });
      }
    });
  }

  searchTrack(e: any = {}): void {
    const httpParams = new HttpParams({ fromObject: e.queryParams || {} });
    const queryParams = httpParams.toString();
    if (queryParams) {
      const url = this.router.url.split('?').shift() + '?' + queryParams;
      let event = Object.assign({}, e, {
        'event': 'google-analytics-search',
        'event_category': e.event_category || 'Search',
        'event_action': e.event_action || 'Search',
        'event_label': e.event_label || e.event_action,
        'event_value': `/#${url}`,
      });
      event = removeUselessObject(event, ['queryParams']);
      this.eventTrack(event);
    }
  }

  eventTrack(e: any = {}): void {
    const event = Object.assign({}, {
      'event': e.event || 'google-analytics-tracking',
      'event_category': e.event_category || 'GA-Track',
      'event_action': e.event_action,
      'event_label': e.event_label,
      'event_value': e.value,
    }, e);
    this.event$.next(event);
  }

  private trackPageView(e: any = {}): void {
    const event = {
      'event': 'google-analytics-pageview',
      'page_location': (() => document.location).call(this),
      'page_path': `#${e.url}`,
      'page_title': e.title,
    };
    this.event$.next(event);
  }

  private pushLayer(layer: any = {}) {
    if (typeof dataLayer !== 'undefined' && dataLayer) {
      layer = this.setDimensionUserId(layer);
      layer = this.setDimensionDocId(layer);
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

  private getPrimaryKey(): string {
    const list = this.router.url.split('/').filter(x => isDocumentUID(x));
    return list.pop();
  }

}
