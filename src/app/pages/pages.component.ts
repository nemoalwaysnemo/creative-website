import { Component, OnInit } from '@angular/core';
import { MENU_ITEMS } from './pages-menu';
@Component({
  selector: 'site-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <creative-layout>
      <nb-menu tag="sidebar" [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </creative-layout>
  `,
})
export class PagesComponent implements OnInit {
  menu = MENU_ITEMS;
  constructor() { }
  ngOnInit() {
    if (window['dataLayer']) {
      window['dataLayer'].push({ 'event': 'optimize.activate' });
    }
  }
}
