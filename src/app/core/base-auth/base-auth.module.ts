import { ModuleWithProviders, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpRequest } from '@angular/common/http';
import { CookieService } from '../services';
import { NbSecurityModule, NbRoleProvider } from '@core/nebular/security';
import { BaseAuthInterceptor } from './services/base-auth-interceptor';
import { NuxeoTokenStorage } from './services/nuxeo-token-storage';
import { of as observableOf } from 'rxjs';
import { NbOAuth2AuthStrategy, NbOAuth2ClientAuthMethod, NbOAuth2ResponseType, NbOAuth2GrantType } from './strategies';
import { NbAuthOAuth2Token, NbTokenStorage } from './services';
import { NB_AUTH_TOKEN_INTERCEPTOR_FILTER } from './base-auth.options';
import { Environment } from '@environment/environment';
import { NbAuthModule } from './auth.module';
import { AuthGuard } from './services/auth-guard.service';

export class NbSimpleRoleProvider extends NbRoleProvider {
  getRole() {
    // here you could provide any role based on any auth flow
    return observableOf('guest');
  }
}

export function filterInterceptorRequest(req: HttpRequest<any>): boolean {
  return ['/nuxeo/api'].some(url => req.url.includes(url));
}

export const NUXEO_AUTH_SERVICES = [
  ...NbAuthModule.forRoot({
    strategies: [
      NbOAuth2AuthStrategy.setup({
        name: 'oauth2',
        clientId: 'nuxeo',
        clientSecret: 'nuxeo',
        clientAuthMethod: NbOAuth2ClientAuthMethod.REQUEST_BODY,
        baseEndpoint: Environment.nuxeoUrl + 'oauth2/',
        redirect: {
          success: '/',
          failure: null,
        },
        authorize: {
          endpoint: 'authorize',
          redirectUri: Environment.oauth2CallBackPath + 'auth/login',
          responseType: NbOAuth2ResponseType.CODE,
        },
        token: {
          endpoint: 'token',
          requireValidToken: false,
          redirectUri: Environment.oauth2CallBackPath + 'auth/login',
          grantType: NbOAuth2GrantType.AUTHORIZATION_CODE,
          class: NbAuthOAuth2Token,
        },
        refresh: {
          endpoint: 'token',
          grantType: NbOAuth2GrantType.REFRESH_TOKEN,
        },
      }),
    ],
  }).providers,
  NbSecurityModule.forRoot({
    accessControl: {
      guest: {
        view: '*',
      },
      user: {
        parent: 'guest',
        create: '*',
        edit: '*',
        remove: '*',
      },
    },
  }).providers,
  { provide: NbTokenStorage, useClass: NuxeoTokenStorage },
  { provide: NbRoleProvider, useClass: NbSimpleRoleProvider },
  { provide: HTTP_INTERCEPTORS, useClass: BaseAuthInterceptor, multi: true },
  { provide: NB_AUTH_TOKEN_INTERCEPTOR_FILTER, useValue: filterInterceptorRequest },
  BaseAuthInterceptor,
  CookieService,
  AuthGuard,
];

@NgModule({
  exports: [
    NbAuthModule,
  ],
})

export class BaseAuthModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: BaseAuthModule,
      providers: [
        ...NUXEO_AUTH_SERVICES,
      ],
    };
  }
}
