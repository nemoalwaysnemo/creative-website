import { NgModule } from '@angular/core';
import { DisruptionHomeModule } from './disruption-home/disruption-home.module';
import { ThemeModule } from '@theme/theme.module';
import { DisruptionDaysModule } from './disruption-days/disruption-days.module';
import { DisruptionRoadmapsModule } from './disruption-roadmaps/disruption-roadmaps.module';
import { DisruptionTheoryModule } from './disruption-theory/disruption-theory.module';
import { DisruptionTheoryFolderModule } from './disruption-theory-folder/disruption-theory-folder.module';
import { DisruptionPageComponent } from './disruption-page.component';
import { DisruptionPageRoutingModule } from './disruption-page-routing.module';
import { DisruptionDaysFolderModule } from './disruption-days-folder/disruption-days-folder.module';
import { DisruptionDayAssetModule } from './disruption-day-asset/disruption-day-asset.module';
import { BrilliantThinkingModule } from './brilliant-thinking/brilliant-thinking.module';
import { DisruptionAssetModule } from './disruption-asset/disruption-asset.module';
import { DisruptionTheoryAssetModule } from './disruption-theory-asset/disruption-theory-asset.module';
import { DisruptionRemotePageModule } from './disruption-remote-page/disruption-remote-page.module';

@NgModule({
  imports: [
    ThemeModule,
    DisruptionHomeModule,
    DisruptionAssetModule,
    DisruptionDaysModule,
    DisruptionRoadmapsModule,
    DisruptionTheoryModule,
    DisruptionTheoryAssetModule,
    DisruptionTheoryFolderModule,
    DisruptionDaysFolderModule,
    DisruptionDayAssetModule,
    BrilliantThinkingModule,
    DisruptionPageRoutingModule,
    DisruptionRemotePageModule,
  ],
  declarations: [
    DisruptionPageComponent,
  ],
})
export class DisruptionPageModule {
}
