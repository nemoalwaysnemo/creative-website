import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DisruptionPageComponent } from './disruption-page.component';
import { HomeComponent } from './home/home.component';
import { DisruptionDaysComponent } from './home/disruption-days/disruption-days.component';
import { DisruptionRoadmapsComponent } from './home/disruption-roadmaps/disruption-roadmaps.component';
import { DisruptionTheoryComponent } from './home/disruption-theory/disruption-theory.component';
const routes: Routes = [{
  path: '',
  component: DisruptionPageComponent,
  children: [
    {
      path: 'home',
      component: HomeComponent,
    },
    {
      path: 'disruptiondays',
      component: DisruptionDaysComponent,
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
      path: '',
      component: HomeComponent,
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
