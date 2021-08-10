/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { NbAuthOptions, NbAuthStrategyClass, NB_AUTH_USER_OPTIONS, NB_AUTH_OPTIONS, NB_AUTH_TOKENS, NB_AUTH_STRATEGIES, NB_AUTH_TOKEN_INTERCEPTOR_FILTER } from './base-auth.options';
import { NbAuthStrategy, NbAuthStrategyOptions, NbOAuth2AuthStrategy } from './strategies';
import { NbAuthTokenClass, NB_AUTH_FALLBACK_TOKEN, NbTokenStorage, NbAuthOAuth2Token, NbTokenLocalStorage, NbAuthTokenParceler, NbAuthService, NbTokenService } from './services';
import { deepExtend } from '@core/services/helpers';

export function nbStrategiesFactory(options: NbAuthOptions, injector: Injector): NbAuthStrategy[] {
  const strategies = [];
  options.strategies
    .forEach(([strategyClass, strategyOptions]: [NbAuthStrategyClass, NbAuthStrategyOptions]) => {
      const strategy: NbAuthStrategy = injector.get(strategyClass);
      strategy.setOptions(strategyOptions);

      strategies.push(strategy);
    });
  return strategies;
}

export function nbTokensFactory(strategies: NbAuthStrategy[]): NbAuthTokenClass[] {
  const tokens = [];
  strategies
    .forEach((strategy: NbAuthStrategy) => {
      tokens.push(strategy.getOption('token.class'));
    });
  return tokens;
}

export function nbOptionsFactory(options): any {
  return deepExtend({ strategies: [] }, options);
}

export function noOpInterceptorFilter(request: HttpRequest<any>): boolean {
  return true;
}

@NgModule()
export class NbAuthModule {
  static forRoot(nbAuthOptions?: NbAuthOptions): ModuleWithProviders<NbAuthModule> {
    return {
      ngModule: NbAuthModule,
      providers: [
        { provide: NB_AUTH_USER_OPTIONS, useValue: nbAuthOptions },
        { provide: NB_AUTH_OPTIONS, useFactory: nbOptionsFactory, deps: [NB_AUTH_USER_OPTIONS] },
        { provide: NB_AUTH_STRATEGIES, useFactory: nbStrategiesFactory, deps: [NB_AUTH_OPTIONS, Injector] },
        { provide: NB_AUTH_TOKENS, useFactory: nbTokensFactory, deps: [NB_AUTH_STRATEGIES] },
        { provide: NB_AUTH_FALLBACK_TOKEN, useValue: NbAuthOAuth2Token },
        { provide: NB_AUTH_TOKEN_INTERCEPTOR_FILTER, useValue: noOpInterceptorFilter },
        { provide: NbTokenStorage, useClass: NbTokenLocalStorage },
        NbAuthTokenParceler,
        NbAuthService,
        NbTokenService,
        NbOAuth2AuthStrategy,
      ],
    };
  }
}
