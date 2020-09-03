import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbMenuService, NbMenuItem } from '@core/nebular/theme';
import { UserService, UserModel } from '@core/api';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Environment, EXTERNAL_LINK } from '@environment/environment';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  user: any = {};

  homePath: string = Environment.homePath;

  guideUrl: string = EXTERNAL_LINK.KNOWLEDGE_GUIDE_URL;

  headerItems: any[] = [
    { title: 'Favorite' },
  ];

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

  private getUser(): void {
    const subscription = this.userService.getCurrentUser().subscribe((user: UserModel) => {
      this.user = user;
    });
    this.subscription.add(subscription);
  }

  private updateHeaderTitle(): void {
    const subscription = this.menuService.onItemClick()
      .pipe(
        filter((menu: { tag: string, item: NbMenuItem }) => menu.tag === 'sidebar'),
        map((menu: { tag: string, item: NbMenuItem }) => menu.item),
      )
      .subscribe((item: NbMenuItem) => {
        this.goToPage(item.title);
      });
    this.subscription.add(subscription);
  }

  selectLayout(type: string): boolean {
    return this.router.url.includes(`/${type}/`);
  }

  goToPage(title: string): void {
    if (title === 'Favorite') {
      this.router.navigate(['/p/favorite']);
    }
  }
}
