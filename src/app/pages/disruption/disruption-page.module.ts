import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { HomePageModule } from './home/home.module';
import { DisruptionPageComponent } from './disruption-page.component';
import { DisruptionPageRoutingModule } from './disruption-page-routing.module';
import { DisruptionDaysModule } from './home/disruption-days/disruption-days.module';
import { DisruptionRoadmapsModule } from './home/disruption-roadmaps/disruption-roadmaps.module';

@NgModule({
  imports: [
    HomePageModule,
    DisruptionDaysModule,
    ThemeModule,
    DisruptionPageRoutingModule,
    DisruptionRoadmapsModule,
  ],
  declarations: [
    DisruptionPageComponent,
  ],
})
export class DisruptionPageModule {
}
