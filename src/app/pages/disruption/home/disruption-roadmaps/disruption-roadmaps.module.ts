import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '../../../shared/shared.module';
import { DisruptionRoadmapsComponent } from './disruption-roadmaps.component';
import { DisruptionMenuModule } from '../../shared/disruption-menu/disruption-menu.module';
import { DisruptionRoadsViewModule } from '../../shared/disruption-roads-view/disruption-roads-view.module';
import { DisruptionSearchFormModule } from '../../shared/disruption-search-form/disruption-search-form.module';
@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    DisruptionMenuModule,
    DisruptionRoadsViewModule,
    DisruptionSearchFormModule,
  ],
  declarations: [
    DisruptionRoadmapsComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class DisruptionRoadmapsModule { }
