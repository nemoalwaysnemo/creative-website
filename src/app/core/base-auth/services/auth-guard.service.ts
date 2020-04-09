import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { of as observableOf, Observable } from 'rxjs';
import { tap, concatMap } from 'rxjs/operators';
import { NbAuthService } from './auth.service';
import { CookieService } from '../../services';
import { ACLService } from '@core/acl/acl.service';

@Injectable()
export class AuthGuard implements CanActivate {

  private authenticated: boolean = false;

  constructor(private aclService: ACLService, private authService: NbAuthService, private router: Router, private cookieService: CookieService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isAuthenticated()
      .pipe(
        tap(authenticated => {
          if (!authenticated) {
            if (!this.getRequestedUrl()) {
              this.setRequestedUrl(state.url);
            }
            this.router.navigate(['/auth/login']);
          }
          this.authenticated = authenticated;
        }),
        concatMap(_ => this.aclService.perform()),
        concatMap(_ => observableOf(this.authenticated)),
      );
  }

  private setRequestedUrl(url: string): void {
    return this.cookieService.set('requestedUrl', url, 3600, '/', undefined, true, 'Lax');
  }

  private getRequestedUrl(): string {
    return this.cookieService.get('requestedUrl');
  }
}
