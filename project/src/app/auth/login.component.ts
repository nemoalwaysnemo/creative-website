import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NbAuthService, NbAuthResult } from '@core/base-auth/services';
import { CookieService } from '@core/services';
import { of as observableOf } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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

  constructor(private authService: NbAuthService, private router: Router, private cookieService: CookieService) {

  }

  ngOnInit(): void {
    this.autoLogin();
  }

  private autoLogin(): void {
    this.authService.isAuthenticated().pipe(
      switchMap((authenticated: boolean) => {
        if (authenticated) {
          return observableOf(new NbAuthResult(true));
        }
        return this.authService.authenticate(this.strategy);
      }),
    ).subscribe((result: NbAuthResult) => {
      this.redirect(result);
    });
  }

  private getRequestedUrl(): string {
    return this.cookieService.get('requestedUrl');
  }

  private clearRequestedUrl(): void {
    this.cookieService.delete('requestedUrl', '/');
  }

  private redirect(result: NbAuthResult): void {
    if (result.isSuccess()) {
      this.messages = result.getMessages();
    } else {
      this.errors = result.getErrors();
    }
    const redirect = result.getRedirect();
    if (this.getRequestedUrl()) {
      this.router.navigateByUrl(this.getRequestedUrl());
      this.clearRequestedUrl();
    } else if (redirect) {
      this.router.navigateByUrl(redirect);
    } else {
      this.router.navigateByUrl('/');
    }
  }
}
