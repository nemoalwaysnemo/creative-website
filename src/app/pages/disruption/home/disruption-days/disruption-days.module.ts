import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '../../../shared/shared.module';
import { DisruptionDaysComponent } from './disruption-days.component';
import { DisruptionMenuModule } from '../../shared/disruption-menu/disruption-menu.module';
import { DisruptionThumbnailViewModule } from '../../shared/disruption-thumbnail-view/disruption-thumbnail-view.module';
import { DisruptionSearchFormModule } from '../../shared/disruption-search-form/disruption-search-form.module';
@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    DisruptionMenuModule,
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
