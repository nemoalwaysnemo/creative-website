import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NbAuthService, NbAuthResult } from '@core/base-auth/services';
import { Router } from '@angular/router';

@Component({
  selector: 'auth-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {

  errors: string[] = [];

  messages: string[] = [];

  private strategy: string = 'oauth2';

  constructor(protected authService: NbAuthService, protected router: Router) {

  }

  ngOnInit() {
    this.autoLogin();
  }

  private autoLogin(): void {
    this.authService.authenticate(this.strategy).subscribe((result: NbAuthResult) => {
      this.redirect(result);
    });
  }

  private redirect(result: NbAuthResult): void {
    if (result.isSuccess()) {
      this.messages = result.getMessages();
    } else {
      this.errors = result.getErrors();
    }
    const redirect = result.getRedirect();
    if (redirect) {
      this.router.navigateByUrl(redirect);
    }
  }
}
