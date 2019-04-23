import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DisruptionPageComponent } from './disruption-page.component';
import { DisruptionDaysComponent } from './disruption-days/disruption-days.component';
import { DisruptionRoadmapsComponent } from './disruption-roadmaps/disruption-roadmaps.component';
import { DisruptionTheoryComponent } from './disruption-theory/disruption-theory.component';
import { DisruptionFoldersComponent } from './disruption-folders/disruption-folders.component';
import { DisruptionDayAssetComponent } from './disruption-day-asset/disruption-day-asset.component';
import { BrilliantThinkingComponent } from './brilliant-thinking/brilliant-thinking.component';
const routes: Routes = [{
  path: '',
  component: DisruptionPageComponent,
  children: [
    {
      path: '',
      redirectTo: 'roadmaps',
      pathMatch: 'full',
    },
    {
      path: 'days',
      component: DisruptionDaysComponent,
    },
    {
      path: 'days/folders/:id',
      component: DisruptionFoldersComponent,
    },
    {
      path: 'days/folder/:folder/asset/:id',
      component: DisruptionDayAssetComponent,
    },
    {
      path: 'roadmaps',
      component: DisruptionRoadmapsComponent,
    },
    {
      path: 'theory',
      component: DisruptionTheoryComponent,
    },
    {
      path: 'thinking',
      component: BrilliantThinkingComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisruptionPageRoutingModule {
}
