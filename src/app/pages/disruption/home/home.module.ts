import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '../../shared/shared.module';
import { HomeComponent } from './home.component';
import { DisruptionDaysModule } from './disruption-days/disruption-days.module';
import { DisruptionRoadmapsModule } from './disruption-roadmaps/disruption-roadmaps.module';
import { DisruptionTheoryModule } from './disruption-theory/disruption-theory.module';
import { DisruptionMenuModule } from '../shared/disruption-menu/disruption-menu.module';
import { DisruptionThumbnailViewModule } from '../shared/disruption-thumbnail-view/disruption-thumbnail-view.module';
import { DisruptionSearchFormModule } from '../shared/disruption-search-form/disruption-search-form.module';
@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    DisruptionDaysModule,
    DisruptionRoadmapsModule,
    DisruptionTheoryModule,
    DisruptionMenuModule,
    DisruptionThumbnailViewModule,
    DisruptionSearchFormModule,
  ],
  declarations: [
    HomeComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class HomePageModule { }
