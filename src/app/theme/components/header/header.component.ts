import { Component, OnInit, OnDestroy, HostBinding} from '@angular/core';
import { UserService, UserModel } from '@core/api';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Environment } from '@environment/environment';
import { NbMenuService, NbMenuItem } from '@core/nebular/theme';
import { filter, map } from 'rxjs/operators';
import { NbSidebarService } from '@core/nebular/theme/components/sidebar/sidebar.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
  animations: [
    trigger('openClose', [
      state('hide', style({
            display: 'block',
            position: 'absolute',
            width: '0px',
            height: '79px',
            background: 'url("/assets/images/logo.png") no-repeat center center',
      })),
      state('logo', style({
            display: 'block',
            position: 'absolute',
            width: '77px',
            height: '79px',
            background: 'url("/assets/images/logo.png") no-repeat center center',
      })),
      transition('hide => logo', [
        animate('0.1s'),
      ]),
      transition('logo => hide', [
        animate('0.1s'),
      ]),
    ]),
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {

  user: any = {};
  title: string;
  private subscription: Subscription = new Subscription();
  logo: boolean = true;

  constructor(private router: Router, private menuService: NbMenuService,
              private userService: UserService, private sidebarService: NbSidebarService) { }
  isOpen = true;

  ngOnInit() {
    this.getUser();
    this.updateHeaderTitle();
    this.sidebarService.onSidebar()
      .subscribe((data: { tag: boolean }) => {
        if (data.tag) {
          this.isOpen = !this.isOpen;
        }
      });
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

  toggleSideBar() {
    this.sidebarService.toggleSidebar(true);
  }
}
