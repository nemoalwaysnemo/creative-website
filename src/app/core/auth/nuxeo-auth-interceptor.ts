import { Inject, Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { NbAuthService, NB_AUTH_TOKEN_INTERCEPTOR_FILTER } from '../nebular/auth';
import { NuxeoAuthToken } from './nuxeo-auth-token';
import { NuxeoApiService } from '../api';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class NuxeoAuthInterceptor implements HttpInterceptor {

  constructor(private injector: Injector,
    @Inject(NB_AUTH_TOKEN_INTERCEPTOR_FILTER) protected filter) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // do not intercept request whose urls are filtered by the injected filter
    if (this.filter(req)) {
      return this.authService.isAuthenticatedOrRefresh()
        .pipe(
          switchMap(authenticated => {
            if (authenticated) {
              return this.authService.getToken().pipe(
                switchMap((token: NuxeoAuthToken) => {
                  if (!this.apiService.isAuthenticated()) {
                    req = req.clone({ setHeaders: this.apiService.nuxeo.getAuthenticationHeaders({ method: 'token', token: token.getValue().token }) });
                  }
                  return next.handle(req);
                }),
              );
            } else {
              // Request is sent to server without authentication so that the client code
              // receives the 401/403 error and can act as desired ('session expired', redirect to login, aso)
              return next.handle(req);
            }
          }),
        );
    } else {
      return next.handle(req);
    }
  }

  protected get authService(): NbAuthService {
    return this.injector.get(NbAuthService);
  }

  protected get apiService(): NuxeoApiService {
    return this.injector.get(NuxeoApiService);
  }

}
