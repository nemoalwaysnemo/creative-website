import { ModuleWithProviders, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpRequest } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NbAuthModule, NbTokenStorage, NB_AUTH_TOKEN_INTERCEPTOR_FILTER } from '@core/nebular/auth';
import { NbSecurityModule, NbRoleProvider } from '@core/nebular/security';
import { NuxeoAuthInterceptor } from './nuxeo-auth-interceptor';
import { NuxeoAuthStrategy } from './nuxeo-auth-strategy';
import { NuxeoTokenStorage } from './nuxeo-token-storage';
import { AuthGuard } from './nuxeo-auth-guard.service';
import { NuxeoAuthToken } from './nuxeo-auth-token';
import { of as observableOf } from 'rxjs';


export class NbSimpleRoleProvider extends NbRoleProvider {
  getRole() {
    // here you could provide any role based on any auth flow
    return observableOf('guest');
  }
}

function filterInterceptorRequest(req: HttpRequest<any>): boolean {
  return ['/nuxeo/api'].some(url => req.url.includes(url));
}

const SERVICES = [
  ...NbAuthModule.forRoot({
    forms: {
      login: {
        strategy: 'nuxeo',
      },
    },
    strategies: [
      NuxeoAuthStrategy.setup({
        name: 'nuxeo',
        token: {
          class: NuxeoAuthToken,
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
  { provide: HTTP_INTERCEPTORS, useClass: NuxeoAuthInterceptor, multi: true },
  { provide: NB_AUTH_TOKEN_INTERCEPTOR_FILTER, useValue: filterInterceptorRequest },
  NuxeoAuthInterceptor,
  NuxeoAuthStrategy,
  CookieService,
  AuthGuard,
];

@NgModule({
  exports: [
    NbAuthModule,
  ],
})

export class NuxeoAuthModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: NuxeoAuthModule,
      providers: [
        ...SERVICES,
      ],
    };
  }
}
