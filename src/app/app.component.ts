import { Component, OnInit } from '@angular/core';
import { GoogleAnalyticsService } from '@core/google-analytics';
import { PageTitleService } from '@core/page-title';
import { ViewportScroller } from '@angular/common';
import { Router, Scroll, Event } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'tbwa-gcl',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller,
    private pageTitleService: PageTitleService,
    private googleAnalytics: GoogleAnalyticsService) {
    router.events.pipe(
      filter((e: Event) => e instanceof Scroll),
      map((e: Event) => e as Scroll),
    ).subscribe(e => {
      if (e.position) {
        // backward navigation
        viewportScroller.scrollToPosition(e.position);
      } else if (e.anchor) {
        // anchor navigation
        viewportScroller.scrollToAnchor(e.anchor);
      } else if (!e.routerEvent.url.includes('scroll')) {
        // forward navigation
        viewportScroller.scrollToPosition([0, 0]);
      }
    });
  }

  ngOnInit(): void {
    this.pageTitleService.titleTrack();
    this.googleAnalytics.pageTrack();
  }

}
