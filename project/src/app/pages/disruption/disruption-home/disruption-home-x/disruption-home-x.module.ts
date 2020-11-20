import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { DisruptionHomeXComponent } from './disruption-home-x.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    DisruptionHomeXComponent,
  ],
  exports: [
    DisruptionHomeXComponent,
  ],
})
export class DisruptionHomeXModule { }
