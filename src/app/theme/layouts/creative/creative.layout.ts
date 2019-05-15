import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { delay, withLatestFrom, takeWhile } from 'rxjs/operators';
import { DeviceDetectorService } from 'ngx-device-detector';
import {
  NbMediaBreakpoint,
  NbMediaBreakpointsService,
  NbMenuItem,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from '@core/nebular/theme';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { StateService } from '@core/services/state.service';

// TODO: move layouts into the framework
@Component({
  selector: 'creative-layout',
  styleUrls: ['./creative.layout.scss'],
  template: `
    <div *ngIf="showTrigger" (mouseenter)="showSideBar()" class="sidebarTrigger"></div>
    <nb-layout [center]="layout.id === 'center-column'" windowMode>
      <nb-layout-header fixed *ngIf="!hideBars">
        <ngx-header></ngx-header>
      </nb-layout-header>

      <nb-sidebar style="top: 0" class="menu-sidebar" tag="menu-sidebar" state="compacted" [end]="sidebar.id === 'end'" *ngIf="!hideBars">
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column class="main-content" (mouseenter)="sidebarHide()">
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>
    </nb-layout>
  `,
  // animations: [
  //   trigger('scroll', [
  //     state('hide', style({
  //           width: '0px',
  //     })),
  //     state('expand', style({
  //           width: '77px',
  //     })),
  //     transition('hide => expand', [
  //       animate('0.05s'),
  //     ]),
  //     transition('expand => hide', [
  //       animate('0.05s'),
  //     ]),
  //   ]),
  // ],
})
export class CreativeLayoutComponent implements OnDestroy {
  hideBars: boolean = false;
  subMenu: NbMenuItem[] = [
    {
      title: 'PAGE LEVEL MENU',
      group: true,
    },
  ];
  layout: any = {};
  sidebar: any = {};
  folded: boolean = false;
  isOpen = true;
  private alive: boolean = true;
  showTrigger: boolean;
  currentTheme: string;
  isDesktopDevice = null;
  constructor(protected stateService: StateService,
    protected menuService: NbMenuService,
    protected themeService: NbThemeService,
    protected bpService: NbMediaBreakpointsService,
    protected sidebarService: NbSidebarService,
    private deviceService: DeviceDetectorService) {
    const isDesktopDevice = this.deviceService.isDesktop();
    this.sidebarService.onHideAllBarsonSidebar()
    .subscribe((data: { close: boolean }) => {
      if (data.close) {
        this.hideBars = true;
      } else {
        this.hideBars = false;
      }
    });
    if ( isDesktopDevice ) {
      this.sidebarService.onStatus()
      .subscribe((res) => {
        if (res.status === 'closed') {
          this.showTrigger = true;
        } else if (res.status === 'opened') {
          this.showTrigger = false;
        }
      });
    }
    this.sidebarService.onSidebarClose()
    .subscribe((data: { tag: boolean }) => {
      if (data.tag && this.isOpen === true) {
        this.isOpen = !this.isOpen;
      }
    });
    this.stateService.onLayoutState()
      .pipe(takeWhile(() => this.alive))
      .subscribe((layout: string) => this.layout = layout);

    this.stateService.onSidebarState()
      .pipe(takeWhile(() => this.alive))
      .subscribe((sidebar: string) => {
        this.sidebar = sidebar;
      });

    const isBp = this.bpService.getByName('xl');
    this.menuService.onItemSelect()
      .pipe(
        takeWhile(() => this.alive),
        withLatestFrom(this.themeService.onMediaQueryChange()),
        delay(20),
      )
      .subscribe(([item, [bpFrom, bpTo]]: [any, [NbMediaBreakpoint, NbMediaBreakpoint]]) => {
        if (bpTo.width <= isBp.width && !isDesktopDevice) {
          this.sidebarService.collapse('menu-sidebar');
        }
      });
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      });
  }
  sidebarHide() {
    this.sidebarService.hideLater('menu-sidebar');
  }

  showSideBar() {
    this.showTrigger = false;
    this.sidebarService.toggle(true, 'menu-sidebar');
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
