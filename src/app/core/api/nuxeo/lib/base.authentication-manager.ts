import { Credentials, AuthenticationToken } from './base.interface';
import { Observable, empty } from 'rxjs';
import { BaseAuth } from './auth.base';
import { TokeAuth } from './auth.token';
import { PortalAuth } from './auth.portal';
import { BearerAuth } from './auth.bearer';

export const DEFAULT_AUTHENTICATOR = {
  computeAuthenticationHeaders: () => { },
  authenticateURL: (url: string) => url,
  canRefreshAuthentication: () => false,
  refreshAuthentication: (baseUrl: string, auth: Credentials): any => empty(),
};


export class AuthenticationManager {

  static authenticators: any = {};
  opts: any = {};

  static registerAuthenticator(method: string, authenticator: any): any {
    AuthenticationManager.authenticators[method] = Object.assign({}, DEFAULT_AUTHENTICATOR, authenticator);
    return AuthenticationManager.authenticators;
  }

  static computeAuthenticationHeaders(auth: Credentials): any {
    if (auth) {
      const authenticator = AuthenticationManager.authenticators[auth.method];
      if (authenticator) {
        return authenticator.computeAuthenticationHeaders(auth);
      }
    }
    return {};
  }

  static authenticateURL(url: string, auth: Credentials): string {
    if (auth) {
      const authenticator = AuthenticationManager.authenticators[auth.method];
      if (authenticator) {
        return authenticator.authenticateURL(url, auth);
      }
    }
    return url;
  }

  static canRefreshAuthentication(auth: Credentials): boolean {
    if (auth) {
      const authenticator = AuthenticationManager.authenticators[auth.method];
      if (authenticator) {
        return authenticator.canRefreshAuthentication();
      }
    }
    return false;
  }

  static refreshAuthentication(baseUrl: string, auth: Credentials): Observable<AuthenticationToken> {
    if (auth) {
      const authenticator = AuthenticationManager.authenticators[auth.method];
      if (authenticator) {
        return authenticator.refreshAuthentication(baseUrl, auth);
      }
    }
    return empty();
  }

}

AuthenticationManager.registerAuthenticator('basic', BaseAuth);
AuthenticationManager.registerAuthenticator('token', TokeAuth);
AuthenticationManager.registerAuthenticator('portal', PortalAuth);
AuthenticationManager.registerAuthenticator('bearerToken', BearerAuth);
