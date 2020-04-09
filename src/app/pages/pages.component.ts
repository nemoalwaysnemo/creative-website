import { Component } from '@angular/core';

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

  constructor() {
    this.setGoogleAnalytics();
  }

  private setGoogleAnalytics(): void {
    if (window['dataLayer']) {
      window['dataLayer'].push({ 'event': 'optimize.activate' });
    }
  }
}
