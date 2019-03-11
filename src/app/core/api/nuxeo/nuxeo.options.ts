import { InjectionToken } from '@angular/core';
import { NuxeoApiOptions } from './lib/base.interface';

export * from './lib/base.interface';
export const NUXEO_ENV = new InjectionToken<NuxeoApiOptions>('NUXEO ENV');
