import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NbAuthService, NbAuthResult } from '@core/base-auth/services';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'auth-logout',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutComponent implements OnInit {

  private strategy: string = 'oauth2';

  private subscription: Subscription = new Subscription();

  constructor(private authService: NbAuthService, private router: Router) {

  }

  ngOnInit(): void {
    this.autoLogout();
  }

  protected onDestroy(): void {
    this.subscription.unsubscribe();
  }

  private autoLogout(): void {
    this.subscription = this.authService.logout(this.strategy)
      .subscribe((result: NbAuthResult) => {
        this.router.navigate(['/auth/login']);
      });
  }
}
