import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '@core/api';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Environment } from '@environment/environment';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  user: any = {};
  title: any;
  private subscription: Subscription = new Subscription();

  constructor(private router: Router, private userService: UserService) {
    const addressUrl = location.href;
    const indexNum = addressUrl.lastIndexOf('\/');
    this.title = addressUrl.substring(indexNum + 1, addressUrl.length);
  }
  ngOnInit() {
    this.getUser();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  goHome() {
    this.router.navigate([Environment.homePath]);
  }

  private getUser(): void {
    this.subscription = this.userService.getCurrentUser().subscribe((user: any) => {
      this.user = user;
      this.user['avatar'] = 'assets/images/user_icon.png';
    });
  }

}
