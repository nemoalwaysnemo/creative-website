import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'site-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <creative-layout>
      <router-outlet></router-outlet>
    </creative-layout>
  `,
})
export class PagesComponent implements OnInit {
  constructor() { }
  ngOnInit() {
    if (window['dataLayer']) {
      window['dataLayer'].push({ 'event': 'optimize.activate' });
    }
  }
}
