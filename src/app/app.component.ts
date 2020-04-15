import { Component, OnInit } from '@angular/core';
import { GoogleAnalyticsService } from '@core/google-analytics';
import { PageTitleService } from '@core/page-title';
import { ViewportScroller } from '@angular/common';
import { Router, Scroll, Event, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'library-web-ui',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller,
    private pageTitleService: PageTitleService,
    private googleAnalytics: GoogleAnalyticsService) {
    this.performScrolling();
  }

  ngOnInit(): void {
    this.pageTitleService.titleTrack();
    this.googleAnalytics.pageTrack();
  }

  private isScrollToTop(e: NavigationEnd): boolean {
    return !e.url.includes('currentPageIndex') && !e.url.includes('q=') && !e.url.includes('_agg=');
  }

  private performScrolling(): void {
    this.router.events.pipe(
      filter((e: Event) => e instanceof Scroll),
      map((e: Event) => e as Scroll),
    ).subscribe(e => {
      if (e.position) {
        // backward navigation
        this.viewportScroller.scrollToPosition(e.position);
      } else if (e.anchor) {
        // anchor navigation
        this.viewportScroller.scrollToAnchor(e.anchor);
      } else if (this.isScrollToTop(e.routerEvent)) {
        this.viewportScroller.scrollToPosition([0, 0]);
      }
    });
  }

}
