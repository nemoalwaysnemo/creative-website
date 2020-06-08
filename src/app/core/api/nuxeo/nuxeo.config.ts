import { InjectionToken } from '@angular/core';
import { NuxeoApiOptions } from './lib/base.interface';
import { Environment } from '@environment/environment';

export * from './lib/base.interface';

export const NUXEO_ENV = new InjectionToken<NuxeoApiOptions>('NUXEO ENV', {
  providedIn: 'root',
  factory: () => new NuxeoApiOptions({
    baseUrl: Environment.nuxeoUrl,
    production: Environment.production,
    appName: Environment.baseTitle,
    assetPath: Environment.assetPath,
  }),
});
