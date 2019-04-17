import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { DisruptionRoadmapsComponent } from './disruption-roadmaps.component';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';

@NgModule({
  imports: [
    ThemeModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
  ],
  declarations: [
    DisruptionRoadmapsComponent,
  ],
  providers: [
  ],
})
export class DisruptionRoadmapsModule { }
