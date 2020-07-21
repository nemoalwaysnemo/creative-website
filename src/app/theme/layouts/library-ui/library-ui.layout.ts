import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { delay, withLatestFrom, takeUntil } from 'rxjs/operators';
import {
  NbMediaBreakpoint,
  NbMediaBreakpointsService,
  NbMenuItem,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from '@core/nebular/theme';

import { StateService } from '@core/services/state.service';

@Component({
  selector: 'library-ui-layout',
  styleUrls: ['./library-ui.layout.scss'],
  template: `
    <nb-layout [center]="layout.id === 'center-column'" windowMode>

      <nb-layout-header *ngIf="!hideHeader" fixed>
        <ngx-header></ngx-header>
      </nb-layout-header>

      <nb-layout-column class="main-content">
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

    </nb-layout>
  `,
})
export class LibraryLayoutComponent implements OnInit, OnDestroy {

  protected destroy$ = new Subject<void>();

  layout: any = {};

  // sidebar: any = {};

  hideHeader: boolean = false;

  // currentTheme: string;

  constructor(private stateService: StateService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private bpService: NbMediaBreakpointsService,
              private sidebarService: NbSidebarService,
  ) {
    this.sidebarService.onHideAllBarsonSidebar()
      .subscribe((data: { close: boolean }) => {
        this.hideHeader = data.close;
      });
  }

  ngOnInit(): void {
    this.stateService.onLayoutState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(layout => this.layout = layout);

    // this.stateService.onSidebarState()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(sidebar => this.sidebar = sidebar);

    // const isBp = this.bpService.getByName('is');
    // this.menuService.onItemSelect()
    //   .pipe(
    //     withLatestFrom(this.themeService.onMediaQueryChange()),
    //     delay(20),
    //     takeUntil(this.destroy$),
    //   )
    //   .subscribe(([item, [bpFrom, bpTo]]: [any, [NbMediaBreakpoint, NbMediaBreakpoint]]) => {
    //     if (bpTo.width <= isBp.width) {
    //       this.sidebarService.collapse('menu-sidebar');
    //     }
    //   });

    // this.themeService.getJsTheme()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(theme => this.currentTheme = theme.name);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // isMenuSidebarPositionEnd(): boolean {
  //   return this.sidebar.id === 'end';
  // }

  // isSettingsSidebarPositionEnd(): boolean {
  //   return !this.isMenuSidebarPositionEnd();
  // }
}
