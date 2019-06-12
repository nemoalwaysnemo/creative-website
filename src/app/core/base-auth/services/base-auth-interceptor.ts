import { Inject, Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, of as observableOf } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { NB_AUTH_TOKEN_INTERCEPTOR_FILTER } from '../base-auth.options';
import { NbAuthToken, NbAuthService } from '.';
import { Router } from '@angular/router';

@Injectable()
export class BaseAuthInterceptor implements HttpInterceptor {

  constructor(private injector: Injector, @Inject(NB_AUTH_TOKEN_INTERCEPTOR_FILTER) private filter, private router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // do not intercept request whose urls are filtered by the injected filter
    if (this.filter(request)) {
      return this.authService.isAuthenticatedOrRefresh()
        .pipe(
          switchMap(authenticated => {
            if (authenticated) {
              return this.authService.getToken().pipe(
                switchMap((token: NbAuthToken) => {
                  request = request.clone({ setHeaders: { Authorization: `Bearer ${token.getValue()}` } });
                  return next.handle(request);
                }),
              );
            } else {
              // Request is sent to server without authentication so that the client code
              // receives the 401/403 error and can act as desired ('session expired', redirect to login, aso)
              return next.handle(request).pipe(
                catchError((error: any, caught) => {
                  // intercept the respons error and displace it to the console
                  console.log(error);
                  this.handleAuthError(error);
                  return observableOf(error);
                }));
            }
          }),
        );
    } else {
      return next.handle(request);
    }
  }

  private handleAuthError(error: HttpErrorResponse): void {
    // handle your auth error or rethrow
    if (error.status === 401) {
      // navigate /delete cookies or whatever
      this.router.navigate(['/auth/login']);
      // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
    } else {
      this.authService.logout('oauth2').subscribe(_ => {
        this.router.navigate(['/auth/login']);
      });
    }
    throw error;
  }

  private get authService(): NbAuthService {
    return this.injector.get(NbAuthService);
  }
}