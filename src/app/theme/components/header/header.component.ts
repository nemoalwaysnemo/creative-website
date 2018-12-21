import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, filter } from 'rxjs/operators';
import { NbMenuService } from '@core/nebular/theme';
import { UserService } from '@core/api';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  user: any = {};

  private alive: boolean = true;

  constructor(private menuService: NbMenuService, private userService: UserService) {
  }

  ngOnInit() {
    this.getUser();
  }

  goHome() {
    this.menuService.navigateHome();
  }

  ngOnDestroy() {
    this.alive = false;
  }

  private getUser(): void {
    this.userService.getCurrentUser().subscribe((user: any) => {
      this.user = user;
      this.user['avatar'] = '/assets/images/user_icon.png';
    });
  }

}
