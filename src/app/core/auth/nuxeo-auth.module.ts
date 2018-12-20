import { ModuleWithProviders, NgModule } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { of as observableOf } from 'rxjs';
import { NbAuthModule, NbTokenStorage } from '@core/nebular/auth';
import { NbSecurityModule, NbRoleProvider } from '@core/nebular/security';
import { NuxeoAuthStrategy } from './nuxeo-auth-strategy';
import { NuxeoTokenStorage } from './nuxeo-token-storage';
import { AuthGuard } from './nuxeo-auth-guard.service';
import { NuxeoAuthToken } from './nuxeo-auth-token';

export class NbSimpleRoleProvider extends NbRoleProvider {
  getRole() {
    // here you could provide any role based on any auth flow
    return observableOf('guest');
  }
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
  CookieService,
  NuxeoAuthStrategy,
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
