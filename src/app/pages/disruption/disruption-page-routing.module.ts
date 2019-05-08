import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DisruptionPageComponent } from './disruption-page.component';
import { DisruptionDaysComponent } from './disruption-days/disruption-days.component';
import { DisruptionRoadmapsComponent } from './disruption-roadmaps/disruption-roadmaps.component';
import { DisruptionTheoryComponent } from './disruption-theory/disruption-theory.component';
import { DisruptionFoldersComponent } from './disruption-folders/disruption-folders.component';
import { DisruptionDayAssetComponent } from './disruption-day-asset/disruption-day-asset.component';
import { BrilliantThinkingComponent } from './brilliant-thinking/brilliant-thinking.component';
import { HomeComponent } from './home/home.component';
const routes: Routes = [{
  path: '',
  component: DisruptionPageComponent,
  children: [
    {
      path: '',
      component: HomeComponent,
      pathMatch: 'full',
    },
    {
      path: 'home',
      component: HomeComponent,
    },
    {
      path: 'Disruption Days',
      component: DisruptionDaysComponent,
    },
    {
      path: 'days/folders/:id',
      component: DisruptionFoldersComponent,
    },
    {
      path: 'days/folders/:folder/asset/:id',
      component: DisruptionDayAssetComponent,
    },
    {
      path: 'days/asset/:id',
      component: DisruptionDayAssetComponent,
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
      path: 'Brilliant Thinking',
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
