import { Component, OnDestroy } from '@angular/core';
import { delay, withLatestFrom, takeWhile } from 'rxjs/operators';
import {
  NbMediaBreakpoint,
  NbMediaBreakpointsService,
  NbMenuItem,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from '@core/nebular/theme';
import { StateService } from '@core/services/state.service';

// TODO: move layouts into the framework
@Component({
  selector: 'creative-layout',
  styleUrls: ['./creative.layout.scss'],
  template: `
    <nb-layout [center]="layout.id === 'center-column'" windowMode>
      <nb-layout-header fixed *ngIf="!hideBars">
        <ngx-header></ngx-header>
      </nb-layout-header>
      <nb-layout-column class="main-content">
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>
    </nb-layout>
  `,
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
  private alive: boolean = true;
  currentTheme: string;
  constructor(protected stateService: StateService,
    protected menuService: NbMenuService,
    protected themeService: NbThemeService,
    protected bpService: NbMediaBreakpointsService,
    protected sidebarService: NbSidebarService) {
    this.sidebarService.onHideAllBarsonSidebar()
      .subscribe((data: { close: boolean }) => {
        if (data.close) {
          this.hideBars = true;
        } else {
          this.hideBars = false;
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
        if (bpTo.width <= isBp.width) {
        }
      });
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
