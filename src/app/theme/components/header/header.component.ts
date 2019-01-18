import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '@core/api';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  user: any = {};

  private subscription: Subscription = new Subscription();

  constructor(private router: Router, private userService: UserService) {
  }

  ngOnInit() {
    this.getUser();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  goHome() {
    this.router.navigate(['/p/home']);
  }

  private getUser(): void {
    this.subscription = this.userService.getCurrentUser().subscribe((user: any) => {
      this.user = user;
      this.user['avatar'] = 'assets/images/user_icon.png';
    });
  }

}
