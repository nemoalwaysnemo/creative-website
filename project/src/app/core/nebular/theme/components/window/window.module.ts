import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbOverlayModule } from '../cdk/overlay';
import { NbCardModule } from '../card/card.module';
import { NbWindowService } from './window.service';
import { NbWindowsContainerComponent } from './windows-container.component';
import { NbWindowComponent } from './window.component';
import { NB_WINDOW_CONFIG, NbWindowConfig } from './window.options';

@NgModule({
  imports: [CommonModule, NbOverlayModule, NbCardModule],
  declarations: [
    NbWindowsContainerComponent,
    NbWindowComponent,
  ],
})
export class NbWindowModule {
  static forRoot(defaultConfig?: Partial<NbWindowConfig>): ModuleWithProviders<NbWindowModule> {
    return {
      ngModule: NbWindowModule,
      providers: [
        NbWindowService,
        { provide: NB_WINDOW_CONFIG, useValue: defaultConfig },
      ],
    };
  }

  static forChild(defaultConfig?: Partial<NbWindowConfig>): ModuleWithProviders<NbWindowModule> {
    return {
      ngModule: NbWindowModule,
      providers: [
        NbWindowService,
        { provide: NB_WINDOW_CONFIG, useValue: defaultConfig },
      ],
    };
  }
}
