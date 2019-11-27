import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NbAuthService, NbAuthResult } from '@core/base-auth/services';
import { Router } from '@angular/router';

@Component({
  selector: 'auth-logout',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutComponent implements OnInit {

  private strategy: string = 'oauth2';

  constructor(private authService: NbAuthService, private router: Router) {

  }

  ngOnInit() {
    this.autoLogout();
  }

  private autoLogout(): void {
    this.authService.logout(this.strategy)
      .subscribe((result: NbAuthResult) => {
        this.router.navigate(['/auth/login']);
      });
  }
}
