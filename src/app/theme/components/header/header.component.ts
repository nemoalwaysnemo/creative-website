import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '@core/api';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  user: any = {};

  private alive: boolean = true;

  constructor(private router: Router, private userService: UserService) {
  }

  ngOnInit() {
    this.getUser();
  }

  goHome() {
    this.router.navigate(['/p/home']);
  }

  ngOnDestroy() {
    this.alive = false;
  }

  private getUser(): void {
    this.userService.getCurrentUser().subscribe((user: any) => {
      this.user = user;
      this.user['avatar'] = 'assets/images/user_icon.png';
    });
  }

}
