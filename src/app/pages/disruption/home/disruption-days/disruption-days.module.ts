import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { DisruptionDaysComponent } from './disruption-days.component';
import { DisruptionThumbnailViewModule } from '../../shared/disruption-thumbnail-view/disruption-thumbnail-view.module';
import { DisruptionSearchFormModule } from '../../shared/disruption-search-form/disruption-search-form.module';
import { DisruptionFormDialogComponent } from './disruption-form-body/disruption-form-dialog.component';
import { DisruptionFormDayModule } from '@pages/shared/disruption-form-day/disruption-form-day.module';
@NgModule({
  imports: [
    ThemeModule,
    SharedModule,

    DisruptionThumbnailViewModule,
    DisruptionSearchFormModule,
    DisruptionFormDayModule,
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
