import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { DisruptionRoadmapsComponent } from './disruption-roadmaps.component';
import { DisruptionListViewModule } from '../../disruption-shared/disruption-list-view/disruption-list-view.module';
import { DisruptionSearchFormModule } from '../../disruption-shared/disruption-search-form/disruption-search-form.module';
@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    DisruptionListViewModule,
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
