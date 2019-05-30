import { InjectionToken } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { NbAuthStrategy, NbAuthStrategyOptions } from './strategies';
import { NbAuthToken, NbAuthTokenClass } from './services/token/token';

export type NbAuthStrategyClass = new (...params: any[]) => NbAuthStrategy;

export type NbAuthStrategies = [NbAuthStrategyClass, NbAuthStrategyOptions][];

export interface NbAuthOptions {
  strategies?: NbAuthStrategies;
}

export const NB_AUTH_OPTIONS = new InjectionToken<NbAuthOptions>('Nebular Auth Options');
export const NB_AUTH_USER_OPTIONS = new InjectionToken<NbAuthOptions>('Nebular User Auth Options');
export const NB_AUTH_STRATEGIES = new InjectionToken<NbAuthStrategies>('Nebular Auth Strategies');
export const NB_AUTH_TOKENS = new InjectionToken<NbAuthTokenClass<NbAuthToken>[]>('Nebular Auth Tokens');
export const NB_AUTH_INTERCEPTOR_HEADER = new InjectionToken<string>('Nebular Simple Interceptor Header');
export const NB_AUTH_TOKEN_INTERCEPTOR_FILTER = new InjectionToken<(req: HttpRequest<any>) => boolean>('Nebular Interceptor Filter');
