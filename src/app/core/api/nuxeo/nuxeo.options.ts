import { InjectionToken } from '@angular/core';
import { NuxeoOptions } from './lib/base.interface';

export * from './lib/base.interface';
export const NUXEO_ENV = new InjectionToken<NuxeoOptions>('NUXEO ENV');
