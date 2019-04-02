import { Component, OnInit } from '@angular/core';
import { MENU_ITEMS } from './pages-menu';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NbSidebarService } from '@core/nebular/theme/components/sidebar/sidebar.service';
@Component({
  selector: 'tbwa-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <tbwa-creative-layout>
      <nb-menu [@scroll]="isOpen? 'expand' : 'hide'" tag="sidebar" [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </tbwa-creative-layout>
  `,
  animations: [
    trigger('scroll', [
      state('hide', style({
            width: '0px',
      })),
      state('expand', style({
            width: '77px',
      })),
      transition('hide => expand', [
        animate('0.1s'),
      ]),
      transition('expand => hide', [
        animate('0.1s'),
      ]),
    ]),
  ],
})
export class PagesComponent implements OnInit {

  isOpen = true;
  menu = MENU_ITEMS;
  constructor(private sidebarService: NbSidebarService) { }
  ngOnInit() {

    this.sidebarService.onSidebarOpen()
    .subscribe((data: { tag: boolean }) => {
      if (data.tag && this.isOpen === false) {
        this.isOpen = !this.isOpen;
      }
    });

    this.sidebarService.onSidebarClose()
    .subscribe((data: { tag: boolean }) => {
      if (data.tag && this.isOpen === true) {
        this.isOpen = !this.isOpen;
      }
    });

    if (window['dataLayer']) {
      window['dataLayer'].push({ 'event': 'optimize.activate' });
    }
  }
}
