import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '../../../shared/shared.module';
import { DisruptionDaysComponent } from './disruption-days.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    DisruptionDaysComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class DisruptionDaysModule { }
