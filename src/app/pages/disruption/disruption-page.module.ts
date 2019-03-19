import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { DisruptionDaysModule } from '../disruption/home/disruption-days/disruption-days.module';
import { DisruptionRoadmapsModule } from '../disruption/home/disruption-roadmaps/disruption-roadmaps.module';
import { DisruptionTheoryModule } from '../disruption/home/disruption-theory/disruption-theory.module';
import { DisruptionPageComponent } from './disruption-page.component';
import { DisruptionPageRoutingModule } from './disruption-page-routing.module';
import { DisruptionFoldersModule  } from './home/disruption-folders/disruption-folders.module';
import { DisruptionAssetsModule } from './home/disruption-assets/disruption-assets.module';
import { BrilliantThinkingModule } from './home/brilliant-thinking/brilliant-thinking.module';

@NgModule({
  imports: [
    DisruptionDaysModule,
    DisruptionRoadmapsModule,
    DisruptionTheoryModule,
    DisruptionFoldersModule,
    DisruptionAssetsModule,
    BrilliantThinkingModule,
    ThemeModule,
    DisruptionPageRoutingModule,
  ],
  declarations: [
    DisruptionPageComponent,
  ],
})
export class DisruptionPageModule {
}
