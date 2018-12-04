import { InjectionToken } from '@angular/core';
import { NuxeoConfigs } from './lib/base.interface';

export * from './lib/base.interface';
export const NUXEO_ENV = new InjectionToken<NuxeoConfigs>('NUXEO ENV');
