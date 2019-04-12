import { Component, OnInit, OnDestroy, HostBinding, AfterViewInit} from '@angular/core';
import { UserService, UserModel } from '@core/api';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Environment } from '@environment/environment';
import { NbMenuService, NbMenuItem } from '@core/nebular/theme';
import { distinctUntilChanged, filter, map, pairwise, share, throttleTime, takeWhile } from 'rxjs/operators';
import { NbSidebarService } from '@core/nebular/theme/components/sidebar/sidebar.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NbLayoutScrollService } from '@core/nebular/theme/services/scroll.service.ts';
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
            top: '-35px',
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
  constructor(private router: Router, private menuService: NbMenuService,
              private userService: UserService, private sidebarService: NbSidebarService,
              protected scrollService: NbLayoutScrollService) { }
  isOpen = true;

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
  }

  ngAfterViewInit() {
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

    goingUp$.subscribe(() => (this.isVisible = true, this.headerHide = '', this.actionTag = true));
    goingDown$.subscribe(() => (this.isVisible = false, this.actionTag = false, setTimeout(() => (this.headerHide = 'none'), 300)));
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  goHome() {
    this.router.navigate([Environment.homePath]);
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
