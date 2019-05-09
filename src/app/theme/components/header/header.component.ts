import { Component, OnInit, OnDestroy, HostBinding, AfterViewInit} from '@angular/core';
import { UserService, UserModel } from '@core/api';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Environment } from '@environment/environment';
import { NbMenuService, NbMenuItem, NbMediaBreakpointsService, NbThemeService, NbMediaBreakpoint} from '@core/nebular/theme';
import { delay, distinctUntilChanged, filter, map, pairwise, share, throttleTime, withLatestFrom } from 'rxjs/operators';
import { NbSidebarService } from '@core/nebular/theme/components/sidebar/sidebar.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NbLayoutScrollService } from '@core/nebular/theme/services/scroll.service.ts';
import { listener } from '@angular/core/src/render3';
enum VisibilityState {
  Visible = 'visible',
  Hidden = 'hidden',
}
enum Direction {
  Up = 'Up',
  Down = 'Down',
}

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
  animations: [
    trigger('userAction', [
      state('actionExist', style({
            top: '22px',
      })),
      state('actionDisappear', style({
            top: '-44px',
      })),
      transition('actionExist => actionDisappear', [
        animate('0.1s'),
      ]),
      transition('actionDisappear => actionExist', [
        animate('0.1s'),
      ]),
    ]),
  ],

})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {
  private isVisible = true;
  actionTag = true;
  user: any = {};
  title: string;
  private subscription: Subscription = new Subscription();
  logo: boolean = true;
  headerHide: any;
  isOpen = true;
  sidebarClosed: boolean = false;
  listenToScroll: boolean = false;
  protected goingUp: Subscription = new Subscription();
  protected goingDown: Subscription = new Subscription();
  constructor(private router: Router, private menuService: NbMenuService,
              protected bpService: NbMediaBreakpointsService,
              protected themeService: NbThemeService,
              private userService: UserService, protected sidebarService: NbSidebarService,
              protected scrollService: NbLayoutScrollService) { }

  ngOnInit() {
    this.getUser();
    this.updateHeaderTitle();

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

    this.sidebarService.onCollapse()
    .subscribe((res) => {
      this.sidebarClosed = true;
    });

    const isBp = this.bpService.getByName('xl');
    this.menuService.onItemSelect()
      .pipe(
        withLatestFrom(this.themeService.onMediaQueryChange()),
        delay(20),
      )
      .subscribe(([item, [bpFrom, bpTo]]: [any, [NbMediaBreakpoint, NbMediaBreakpoint]]) => {
        if (bpTo.width <= isBp.width) {
          this.sidebarClosed = true;
          this.scrollService.stopScrollListener(true);
        }
      });
  }

  ngAfterViewInit() {
    if (this.listenToScroll) {
      const scroll$ = this.scrollService
                      .onScroll()
                      .pipe(
                        throttleTime(100),
                        map(() => window.pageYOffset),
                        pairwise(),
                        map(([y1, y2]): Direction => (y2 < y1 ? Direction.Up : Direction.Down)),
                        distinctUntilChanged(),
                        share(),
                      );

      const goingUp$ = scroll$.pipe(
        filter(direction => direction === Direction.Up),
      );

      const goingDown$ = scroll$.pipe(
        filter(direction => direction === Direction.Down),
      );

      this.goingUp = goingUp$.subscribe(() => (this.isVisible = true, this.headerHide = '', this.actionTag = true));
      this.goingDown = goingDown$.subscribe(() => (this.isVisible = false, this.actionTag = false, setTimeout(() => (this.headerHide = 'none'), 300)));
    }
    this.scrollService.onScrollListen()
    .subscribe((res) => {
      if (res) {
        if (res.stop === true) {
          this.goingUp.unsubscribe();
          this.goingDown.unsubscribe();
          this.listenToScroll = false;
        }
      }
    });
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  goHome() {
    this.router.navigate([Environment.homePath]);
  }

  sidebarToggle() {
    if ( this.sidebarClosed ) {
      this.sidebarService.toggle(true, 'menu-sidebar');
      this.sidebarClosed = false;
    } else {
      this.sidebarService.collapse('menu-sidebar');
      this.sidebarClosed = true;
    }
  }
  private getUser(): void {
    const subscription = this.userService.getCurrentUser().subscribe((user: UserModel) => {
      this.user = user;
    });
    this.subscription.add(subscription);
  }

  private updateHeaderTitle(): void {
    const subscription = this.menuService.onItemSelect()
      .pipe(
        filter((menu: { tag: string, item: NbMenuItem }) => menu.tag === 'sidebar'),
        map((menu: { tag: string, item: NbMenuItem }) => menu.item),
      )
      .subscribe((item: NbMenuItem) => {
        this.title = item.title;
      });
    this.subscription.add(subscription);
  }

  openSidebar() {
    this.sidebarService.openSidebar(true);
  }

  closeSidebar() {
    this.sidebarService.closeSidebar(true);
  }
}
