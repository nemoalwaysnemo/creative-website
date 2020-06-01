import { Component, OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { Router, Scroll, NavigationEnd } from '@angular/router';
import { DocumentPageService } from '@pages/shared';
import { filter, map, pairwise, withLatestFrom } from 'rxjs/operators';
import { timer } from 'rxjs';

@Component({
  selector: 'library-web-ui',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller,
    private documentPageService: DocumentPageService) {
    this.performScrolling();
  }

  ngOnInit(): void {
    this.documentPageService.trackTitle();
  }

  private isScrollToTop(e: NavigationEnd, previousUrl: string): boolean {
    return e.url.includes('/asset/');
  }

  private performScrolling(): void {
    const scrollEvents$ = this.router.events.pipe(
      filter(event => event instanceof Scroll),
      map(event => event as Scroll),
    );
    // Emits the previous URL after the router navigates to a new URL
    const originUrl$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => event as NavigationEnd),
      pairwise(),
      map(navigationEvents => navigationEvents[0].url),
    );
    scrollEvents$.pipe(
      withLatestFrom(originUrl$),
    ).subscribe(([scrollEvent, originUrl]) => {
      if (scrollEvent.position) {
        // backward navigation
        this.viewportScroller.scrollToPosition(scrollEvent.position);
      } else if (scrollEvent.anchor) {
        // anchor navigation
        this.viewportScroller.scrollToAnchor(scrollEvent.anchor);
      } else if (this.isScrollToTop(scrollEvent.routerEvent, originUrl)) {
        // forward navigation from non-modal route
        timer(300).subscribe(() => { this.viewportScroller.scrollToPosition([0, 0]); });
      }
    });
  }

}
