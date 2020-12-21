import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LearningSearchComponent } from './learning-search.component';
import { LearningProgramAlumniSearchComponent } from './learning-program-alumni-search/learning-program-alumni-search.component';

const routes: Routes = [{
  path: '',
  component: LearningSearchComponent,
  children: [
    {
      path: 'alumni',
      component: LearningProgramAlumniSearchComponent,
    },
    {
      path: '',
      redirectTo: 'alumni',
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LearningSearchRoutingModule {
}
