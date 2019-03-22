import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { DisruptionDaysComponent } from './disruption-days.component';
import { DisruptionThumbnailViewModule } from '../../disruption-shared/disruption-thumbnail-view/disruption-thumbnail-view.module';
import { DisruptionSearchFormModule } from '../../disruption-shared/disruption-search-form/disruption-search-form.module';
@NgModule({
  imports: [
    ThemeModule,
    SharedModule,

    DisruptionThumbnailViewModule,
    DisruptionSearchFormModule,
  ],
  declarations: [
    DisruptionDaysComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class DisruptionDaysModule { }
