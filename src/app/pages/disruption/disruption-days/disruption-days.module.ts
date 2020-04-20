import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { DisruptionDaysComponent } from './disruption-days.component';
import { GlobalSearchFormModule, GlobalSearchResultModule, PreviewDialogModule } from '../../shared';
import { DisruptionFormDayModule } from '../../shared/disruption-form-day/disruption-form-day.module';
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
})
export class DisruptionDaysModule { }
