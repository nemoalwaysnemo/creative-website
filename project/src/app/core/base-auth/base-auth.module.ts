import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpRequest } from '@angular/common/http';
import { BaseAuthInterceptor } from './services/base-auth-interceptor';
import { NuxeoTokenStorage } from './services/nuxeo-token-storage';
import { NbOAuth2AuthStrategy, NbOAuth2ClientAuthMethod, NbOAuth2ResponseType, NbOAuth2GrantType } from './strategies';
import { NbAuthOAuth2Token, NbTokenStorage } from './services';
import { NB_AUTH_TOKEN_INTERCEPTOR_FILTER } from './base-auth.options';
import { Environment } from '@environment/environment';
import { NbAuthModule } from './auth.module';

export function filterInterceptorRequest(req: HttpRequest<any>): boolean {
  return ['/nuxeo/api'].some(url => req.url.includes(url));
}

export const NUXEO_AUTH_MODULE = [
  NbAuthModule.forRoot({
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
  }),
];

@NgModule({
  imports: [
    ...NUXEO_AUTH_MODULE,
  ],
  providers: [
    { provide: NbTokenStorage, useClass: NuxeoTokenStorage },
    { provide: HTTP_INTERCEPTORS, useClass: BaseAuthInterceptor, multi: true },
    { provide: NB_AUTH_TOKEN_INTERCEPTOR_FILTER, useValue: filterInterceptorRequest },
  ],
})
export class BaseAuthModule {

}
