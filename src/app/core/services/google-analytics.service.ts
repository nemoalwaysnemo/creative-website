import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ReplaySubject, Observable, of as observableOf } from 'rxjs';
import { distinctUntilChanged, map, tap, concatMap, filter } from 'rxjs/operators';
import { removeUselessObject, isDocumentUID } from '../services/helpers';
import { NbAuthService } from '../base-auth/services';
import { NuxeoApiService } from '../api/nuxeo/nuxeo.api.service';
import { NuxeoAutomations } from '../api/nuxeo/lib/base.interface';
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
    private titleService: Title,
    private nuxeoApi: NuxeoApiService,
    private authService: NbAuthService,
    private activatedRoute: ActivatedRoute,
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

  pageTrack(): void {
    this.router.events.pipe(
      distinctUntilChanged(),
    ).subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (!this.activatedRoute.snapshot.queryParamMap.has('q')) {
          this.trackPageView({ url: event.url, title: this.titleService.getTitle() });
        }
      }
    });
  }

  searchTrack(e: any = {}): void {
    const event = Object.assign({}, e, {
      'event': 'google-analytics-search',
      'event_category': e.category || 'Search',
      'event_action': e.action || 'Search',
      'event_label': e.label || e.action,
      'event_value': `/#${this.router.url}`,
    });
    this.eventTrack(event);
  }

  eventTrack(e: any = {}): void {
    let event = Object.assign({
      'event': e.event || 'google-analytics-tracking',
      'event_category': e.category || 'GA-Track',
      'event_action': e.action,
      'event_label': e.label,
      'event_value': e.value,
    }, e);
    event = removeUselessObject(event, ['category', 'action', 'label', 'docId']);
    this.event$.next(event);
  }

  private trackPageView(e: any = {}): void {
    let event = Object.assign({
      'event': 'google-analytics-pageview',
      'page_location': (() => document.location).call(this),
      'page_path': `#${e.url}`,
      'page_title': e.title,
    }, e);
    event = removeUselessObject(event, ['title', 'url']);
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
    if (docId && !event['dimensions.docId']) {
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
    return list.shift();
  }

}
