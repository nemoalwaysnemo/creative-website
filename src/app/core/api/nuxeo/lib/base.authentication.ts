import { Authentication, Credentials, NuxeoOptions, AuthenticationToken } from './base.interface';
import { Observable, of as observableOf, empty } from 'rxjs';
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


export abstract class BaseAuthentication implements Authentication {

  static authenticators: any = {};
  opts?: any;

  static registerAuthenticator(method: string, authenticator: any): any {
    BaseAuthentication.authenticators[method] = Object.assign({}, DEFAULT_AUTHENTICATOR, authenticator);
    return BaseAuthentication.authenticators;
  }

  static computeAuthenticationHeaders(auth: Credentials): any {
    if (auth) {
      const authenticator = BaseAuthentication.authenticators[auth.method];
      if (authenticator) {
        return authenticator.computeAuthenticationHeaders(auth);
      }
    }
    return {};
  }

  static authenticateURL(url: string, auth: Credentials): string {
    if (auth) {
      const authenticator = BaseAuthentication.authenticators[auth.method];
      if (authenticator) {
        return authenticator.authenticateURL(url, auth);
      }
    }
    return url;
  }

  static canRefreshAuthentication(auth: Credentials): boolean {
    if (auth) {
      const authenticator = BaseAuthentication.authenticators[auth.method];
      if (authenticator) {
        return authenticator.canRefreshAuthentication();
      }
    }
    return false;
  }

  static refreshAuthentication(baseUrl: string, auth: Credentials): Observable<AuthenticationToken> {
    if (auth) {
      const authenticator = BaseAuthentication.authenticators[auth.method];
      if (authenticator) {
        return authenticator.refreshAuthentication(baseUrl, auth);
      }
    }
    return empty();
  }

}

BaseAuthentication.registerAuthenticator('basic', BaseAuth);
BaseAuthentication.registerAuthenticator('token', TokeAuth);
BaseAuthentication.registerAuthenticator('portal', PortalAuth);
BaseAuthentication.registerAuthenticator('bearerToken', BearerAuth);
