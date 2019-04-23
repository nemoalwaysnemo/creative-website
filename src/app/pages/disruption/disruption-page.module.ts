import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { DisruptionDaysModule } from './disruption-days/disruption-days.module';
import { DisruptionRoadmapsModule } from './disruption-roadmaps/disruption-roadmaps.module';
import { DisruptionTheoryModule } from './disruption-theory/disruption-theory.module';
import { DisruptionPageComponent } from './disruption-page.component';
import { DisruptionPageRoutingModule } from './disruption-page-routing.module';
import { DisruptionFoldersModule  } from './disruption-folders/disruption-folders.module';
import { DisruptionDayAssetModule } from './disruption-day-asset/disruption-day-asset.module';
import { BrilliantThinkingModule } from './brilliant-thinking/brilliant-thinking.module';

@NgModule({
  imports: [
    ThemeModule,
    DisruptionDaysModule,
    DisruptionRoadmapsModule,
    DisruptionTheoryModule,
    DisruptionFoldersModule,
    DisruptionDayAssetModule,
    BrilliantThinkingModule,
    DisruptionPageRoutingModule,
  ],
  declarations: [
    DisruptionPageComponent,
  ],
})
export class DisruptionPageModule {
}
