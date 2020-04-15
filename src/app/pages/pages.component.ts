import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { distinctUntilChanged } from 'rxjs/operators';

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

  constructor(private router: Router) {
    this.setGoogleAnalyticsTrack();
  }

  private setGoogleAnalyticsTrack(): void {
    if (window['dataLayer']) {
      window['dataLayer'].push({ 'event': 'optimize.activate' });
    }
  }

}
