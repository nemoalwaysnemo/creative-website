import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DisruptionPageComponent } from './disruption-page.component';
import { DisruptionDaysComponent } from './home/disruption-days/disruption-days.component';
import { DisruptionRoadmapsComponent } from './home/disruption-roadmaps/disruption-roadmaps.component';
import { DisruptionTheoryComponent } from './home/disruption-theory/disruption-theory.component';
import { DisruptionFoldersComponent } from './home/disruption-folders/disruption-folders.component';
const routes: Routes = [{
  path: '',
  component: DisruptionPageComponent,
  children: [
      {
        path: '',
        redirectTo: 'days',
        pathMatch: 'full',
      },
      {
        path: 'days',
        component: DisruptionDaysComponent,
      },
      {
        path: 'days/folders',
        component: DisruptionFoldersComponent,
      },
      {
        path: 'roadmaps',
        component: DisruptionRoadmapsComponent,
      },
      {
        path: 'theory',
        component: DisruptionTheoryComponent,
      },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisruptionPageRoutingModule {
}
