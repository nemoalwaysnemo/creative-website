import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { DisruptionDaysComponent } from './disruption-days.component';
import { GlobalSearchFormModule, GlobalSearchResultModule, PreviewDialogModule } from '@pages/shared';
import { DisruptionFormDayModule } from '@pages/shared/disruption-form-day/disruption-form-day.module';
import { DisruptionFormButtonModule } from '../disruption-form-button/disruption-form-button.module';
@NgModule({
  imports: [
    ThemeModule,
    PreviewDialogModule,
    DisruptionFormDayModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    DisruptionFormButtonModule,
  ],
  declarations: [
    DisruptionDaysComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class DisruptionDaysModule { }
