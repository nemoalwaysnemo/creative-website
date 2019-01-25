import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { NuxeoAuthModule } from './auth';
import { APIModule } from './api';

import {
  StateService,
  LayoutService,
} from './services';

const PROVIDERS = [
  StateService,
  LayoutService,
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
