import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { AbService } from './services/ab.service';
import { NuxeoAuthModule } from './auth';
import { APIModule } from './api';

import {
  UserService,
  StateService,
  LayoutService,
  AnalyticsService,
} from './services';

const PROVIDERS = [
  AnalyticsService,
  AbService,
  UserService,
  StateService,
  LayoutService,
  AnalyticsService,
  APIModule.forRoot().providers,
  NuxeoAuthModule.forRoot().providers,
];

@NgModule({
  imports: [
    APIModule,
    NuxeoAuthModule,
    CommonModule,
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CoreModule,
      providers: [
        ...PROVIDERS,
      ],
    };
  }
}
