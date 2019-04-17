import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { DisruptionDaysComponent } from './disruption-days.component';
import { DisruptionFormDialogComponent } from './disruption-form-body/disruption-form-dialog.component';
import { GlobalSearchFormModule, GlobalSearchResultModule, PreviewDialogModule } from '@pages/shared';
import { DisruptionFormDayModule } from '@pages/shared/disruption-form-day/disruption-form-day.module';

@NgModule({
  imports: [
    ThemeModule,
    PreviewDialogModule,
    DisruptionFormDayModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
  ],
  declarations: [
    DisruptionDaysComponent,
    DisruptionFormDialogComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class DisruptionDaysModule { }
