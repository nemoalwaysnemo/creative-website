import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService, UserModel } from '@core/api';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Environment } from '@environment/environment';
import { NbMenuService, NbMenuItem } from '@core/nebular/theme';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  user: any = {};

  title: string;


  isOpen = true;

  sidebarClosed: boolean = false;

  private subscription: Subscription = new Subscription();

  constructor(private router: Router, private menuService: NbMenuService, private userService: UserService) {

  }
  ngOnInit(): void {
    this.getUser();
    this.updateHeaderTitle();
  }

  ngOnDestroy(): void {
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

  selectLayout(type: string): boolean {
    return this.router.url.includes(`/${type}/`);
  }

}
