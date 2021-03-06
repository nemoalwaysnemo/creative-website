import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DisruptionPageComponent } from './disruption-page.component';
import { DisruptionDaysComponent } from './disruption-days/disruption-days.component';
import { DisruptionRoadmapsComponent } from './disruption-roadmaps/disruption-roadmaps.component';
import { DisruptionTheoryComponent } from './disruption-theory/disruption-theory.component';
import { DisruptionDaysFolderComponent } from './disruption-days-folder/disruption-days-folder.component';
import { DisruptionDayAssetComponent } from './disruption-day-asset/disruption-day-asset.component';
import { BrilliantThinkingComponent } from './brilliant-thinking/brilliant-thinking.component';
import { DisruptionHomeComponent } from './disruption-home/disruption-home.component';
import { DisruptionAssetComponent } from './disruption-asset/disruption-asset.component';
import { DisruptionTheoryAssetComponent } from './disruption-theory-asset/disruption-theory-asset.component';
import { DisruptionTheoryFolderComponent } from './disruption-theory-folder/disruption-theory-folder.component';
import { DisruptionTheoryRemotePageComponent } from './disruption-theory-remote-page/disruption-theory-remote-page.component';
import { DisruptionXDaysComponent } from './disruption-x-days/disruption-x-days.component';
import { DisruptionXComponent } from './disruption-x/disruption-x.component';

const routes: Routes = [{
  path: '',
  component: DisruptionPageComponent,
  children: [
    {
      path: 'home',
      component: DisruptionHomeComponent,
    },
    {
      path: 'asset/:id',
      component: DisruptionAssetComponent,
    },
    {
      path: 'Disruption Days',
      component: DisruptionDaysComponent,
    },
    {
      path: 'Disruption Days/day/:id',
      component: DisruptionDaysFolderComponent,
    },
    {
      path: 'Disruption Days/day/:folder/asset/:id',
      component: DisruptionDayAssetComponent,
    },
    {
      path: 'Disruption How Tos/remote/:id',
      component: DisruptionTheoryRemotePageComponent,
    },
    {
      path: 'Disruption How Tos/folder/:id',
      component: DisruptionTheoryFolderComponent,
    },
    {
      path: 'Disruption How Tos/folder/:folder/asset/:id',
      component: DisruptionTheoryAssetComponent,
    },
    {
      path: 'Disruption Roadmaps',
      component: DisruptionRoadmapsComponent,
    },
    {
      path: 'Disruption How Tos',
      component: DisruptionTheoryComponent,
    },
    {
      path: 'DisruptionX',
      component: DisruptionXComponent,
    },
    {
      path: 'DisruptionX/Days',
      component: DisruptionXDaysComponent,
    },
    {
      path: 'Things to Steal',
      component: BrilliantThinkingComponent,
    },
    {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisruptionPageRoutingModule {
}
