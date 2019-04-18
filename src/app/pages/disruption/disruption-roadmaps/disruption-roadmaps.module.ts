import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { DisruptionRoadmapsComponent } from './disruption-roadmaps.component';
import { GlobalSearchFormModule, GlobalSearchResultModule, PreviewDialogModule } from '@pages/shared';
import { DisruptionFormRoadmapModule } from '@pages/shared/disruption-form-roadmap/disruption-form-roadmap.module';
import { DisruptionFormRoadmapsDialogComponent } from './disruption-form-roadmaps-body/disruption-form-roadmaps-dialog.component';

@NgModule({
  imports: [
    ThemeModule,
    PreviewDialogModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    DisruptionFormRoadmapModule,
  ],
  declarations: [
    DisruptionRoadmapsComponent,
    DisruptionFormRoadmapsDialogComponent,
  ],
  providers: [
  ],
})
export class DisruptionRoadmapsModule { }
