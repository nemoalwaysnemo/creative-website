import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { distinctUntilChanged } from 'rxjs/operators';
import { Environment } from '@environment/environment';
import { removeUselessObject } from '@core/services';
import { Title } from '@angular/platform-browser';

declare let dataLayer: any;

export const ANALYTICS_VARIABLES = {
  Event: {
    Custom: 'google-analytics-tracking',
    PageView: 'google-analytics-pageview',
  },
  Dimensions: {
    DocId: 'dimensions.docId',
    UserId: 'dimensions.userId',
  },
};

@Injectable()
export class GoogleAnalyticsService {

  constructor(private router: Router, private titleService: Title) {
    // The dataLayer needs to be initialized
    if (typeof dataLayer !== 'undefined' && dataLayer) {
      dataLayer = (window as any).dataLayer = (window as any).dataLayer || [];
    }
  }

  pageTrack(): void {
    this.router.events.pipe(
      distinctUntilChanged(),
    ).subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.trackPageView({ url: event.url, title: this.titleService.getTitle() });
      }
    });
  }

  eventTrack(e: any = {}): void {
    let event = Object.assign({
      'event': e.event || 'google-analytics-tracking',
      'event_category': e.category || 'GA-Track',
      'event_action': this.buildPrefix(e.action),
      'event_label': e.label,
      'dimensions.docId': this.buildPrefix(e.docId),
    }, e);
    event = removeUselessObject(event, ['category', 'action', 'label', 'docId']);
    this.pushLayer(event);
  }

  private pushLayer(layer: any = {}) {
    if (typeof dataLayer !== 'undefined' && dataLayer) {
      dataLayer.push(layer);
    }
  }

  private trackPageView(e: any = {}): void {
    let event = Object.assign({
      'event': 'google-analytics-pageview',
      'page_location': document.location,
      'page_path': `#${e.url}`,
      'page_title': e.title,
    }, e);
    event = removeUselessObject(event, ['title', 'url']);
    this.pushLayer(event);
  }

  private buildPrefix(str: string): string {
    return `${Environment.server} ${str}`;
  }

}
