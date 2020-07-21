import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NbSidebarService } from '@core/nebular/theme';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'library-ui-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <library-ui-layout>
      <router-outlet></router-outlet>
    </library-ui-layout>
  `,
})
export class PagesComponent {

  protected subscription: Subscription = new Subscription();

  constructor(private router: Router, private sidebarService: NbSidebarService) {
    this.setGoogleAnalyticsTrack();
    this.subscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    ).subscribe((e: NavigationEnd) => {
      if (['/p/knowledge', '/p/backslash/asset'].some((path: string) => e.url.includes(path))) {
        this.sidebarService.closeAllBars(true);
      } else {
        this.sidebarService.closeAllBars(false);
      }
    });
  }

  private setGoogleAnalyticsTrack(): void {
    if (window['dataLayer']) {
      window['dataLayer'].push({ 'event': 'optimize.activate' });
    }
  }

}
