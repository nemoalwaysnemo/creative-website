import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LearningPageComponent } from './learning-page.component';
import { LearningHomeComponent } from './learning-home/learning-home.component';
import { LearningAlumniComponent } from './learning-alumni/learning-alumni.component';
import { LearningProgramComponent } from './learning-program/learning-program.component';
import { LearningRemotePageComponent } from './learning-remote-page/learning-remote-page.component';

const routes: Routes = [{
  path: '',
  component: LearningPageComponent,
  children: [
    {
      path: 'home',
      component: LearningHomeComponent,
    },
    {
      path: 'program',
      component: LearningProgramComponent,
    },
    {
      path: 'alumni',
      component: LearningAlumniComponent,
    },
    {
      path: 'remote/:id',
      component: LearningRemotePageComponent,
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
export class LearningPageRoutingModule {
}
