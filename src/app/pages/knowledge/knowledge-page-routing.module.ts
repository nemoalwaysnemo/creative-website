import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { KnowledgePageComponent } from './knowledge-page.component';
import { KnowledgeHomeComponent } from './knowledge-home/knowledge-home.component';

const routes: Routes = [{
  path: '',
  component: KnowledgePageComponent,
  children: [
    {
      path: 'home',
      component: KnowledgeHomeComponent,
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
export class KnowledgePageRoutingModule {
}
