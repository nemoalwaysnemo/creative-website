import { ModuleWithProviders, NgModule } from '@angular/core';

import { NbFocusTrapFactoryService } from './focus-trap';


@NgModule({})
export class NbA11yModule {
  static forRoot(): ModuleWithProviders<NbA11yModule> {
    return {
      ngModule: NbA11yModule,
      providers: [NbFocusTrapFactoryService],
    };
  }
}
