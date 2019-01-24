import { Component, OnInit } from '@angular/core';
import { MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'tbwa-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <tbwa-creative-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </tbwa-creative-layout>
  `,
})
export class PagesComponent implements OnInit {

  menu = MENU_ITEMS;

  ngOnInit() {
    if (window['dataLayer']) {
      window['dataLayer'].push({ 'event': 'optimize.activate' });
    }
  }
}
