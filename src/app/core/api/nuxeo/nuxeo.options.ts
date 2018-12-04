import { InjectionToken } from '@angular/core';
import { NuxeoConfigs } from './api/base.interface';

export * from './api/base.interface';
export const NUXEO_ENV = new InjectionToken<NuxeoConfigs>('NUXEO ENV');
