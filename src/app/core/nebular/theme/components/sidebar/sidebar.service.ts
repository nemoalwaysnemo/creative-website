/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { DeviceDetectorService } from 'ngx-device-detector';

/**
 * Sidebar service.
 *
 * Root module service to control the sidebar from any part of the app.
 *
 * Allows you to change sidebar state dynamically from any part of the app:
 * @stacked-example(Sidebar State, sidebar/sidebar-toggle.component)
 */
@Injectable()
export class NbSidebarService {
  constructor( private deviceService: DeviceDetectorService ) { }
  private toggle$ = new Subject<{ compact: boolean, tag: string }>();
  private expand$ = new Subject<{ tag: string }>();
  private collapse$ = new Subject<{ tag: string }>();
  private sidebarToggle$ = new Subject<{ tag: boolean }>();
  private sidebarOpen$ = new Subject<{ tag: boolean }>();
  private sidebarClose$ = new Subject<{ tag: boolean }>();
  private sidebarStatus$ = new Subject<{ status: string }>();
  private hideAllBars$ = new Subject<{ close: boolean }>();
  sidebarTimeId: any;
  waitingHiding: boolean = false;
  isDesktopDevice = this.deviceService.isDesktop();

  onHideAllBarsonSidebar(): Observable<{ close: boolean }> {
    return this.hideAllBars$.pipe(share());
  }

  closeAllBars (close?: boolean) {
    this.hideAllBars$.next({ close: close });
  }

  onSidebar(): Observable<{ tag: boolean }> {
    return this.sidebarToggle$.pipe(share());
  }

  toggleSidebar(tag?: boolean) {
    setTimeout(() =>  this.sidebarToggle$.next({ tag }), 200);
  }

  onSidebarOpen(): Observable<{ tag: boolean }> {
    return this.sidebarOpen$.pipe(share());
  }

  onSidebarClose(): Observable<{ tag: boolean }> {
    return this.sidebarClose$.pipe(share());
  }

  openSidebar(compact = false, tag?: string) {
    this.toggle(compact, tag);
    this.sidebarStatus$.next({ status: 'opened' });
  }
  closeSidebar(tag: string) {
    this.collapse(tag);
    this.sidebarStatus$.next({ status: 'closed' });
  }

  hideLater(tag?: string) {
    if ( this.isDesktopDevice ) {
      if ( !this.waitingHiding ) {
        this.waitingHiding = true;
        this.sidebarTimeId = setTimeout(() => {
          this.collapse(tag);
          this.sidebarStatus$.next({ status: 'closed' });
          this.waitingHiding = false;
        }, 5000);
      }
    }
  }
  clearSidebarHiding() {
    if ( this.sidebarTimeId ) {
      clearTimeout(this.sidebarTimeId);
      this.waitingHiding = false;
    }
  }
  /**
   * Subscribe to toggle events
   *
   * @returns Observable<{ compact: boolean, tag: string }>
   */
  onToggle(): Observable<{ compact: boolean, tag: string }> {
    return this.toggle$.pipe(share());
  }

  /**
   * Subscribe to expand events
   * @returns Observable<{ tag: string }>
   */
  onExpand(): Observable<{ tag: string }> {
    return this.expand$.pipe(share());
  }

  /**
   * Subscribe to collapse evens
   * @returns Observable<{ tag: string }>
   */
  onCollapse(): Observable<{ tag: string }> {
    return this.collapse$.pipe(share());
  }

  /**
   * Subscribe to sidebar status
   * @returns Observable<{ tag: string }>
   */
  onStatus(): Observable<{ status: string }> {
    return this.sidebarStatus$.pipe(share());
  }

  /**
   * Toggle a sidebar
   * @param {boolean} compact
   * @param {string} tag If you have multiple sidebars on the page, mark them with `tag` input property and pass it here
   * to specify which sidebar you want to control
   */
  toggle(compact = false, tag?: string) {
    this.toggle$.next({ compact, tag });
  }

  /**
   * Expands a sidebar
   * @param {string} tag If you have multiple sidebars on the page, mark them with `tag` input property and pass it here
   * to specify which sidebar you want to control
   */
  expand(tag?: string) {
    this.expand$.next({ tag });
  }

  /**
   * Collapses a sidebar
   * @param {string} tag If you have multiple sidebars on the page, mark them with `tag` input property and pass it here
   * to specify which sidebar you want to control
   */
  collapse(tag?: string) {
    this.collapse$.next({ tag });
    this.sidebarStatus$.next({ status: 'collapse' });
  }

}
