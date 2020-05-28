import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { InnovationPageComponent } from './innovation-page.component';
import { InnovationHomeComponent } from './innovation-home/innovation-home.component';
import { InnovationRemotePageComponent } from './innovation-remote-page/innovation-remote-page.component';
import { InnovationFolderComponent } from './innovation-folder/innovation-folder.component';
import { InnovationListComponent } from './innovation-list/innovation-list.component';

const routes: Routes = [{
  path: '',
  component: InnovationPageComponent,
  children: [
    {
      path: 'home',
      component: InnovationHomeComponent,
    },
    {
      path: 'NEXT',
      component: InnovationListComponent,
    },
    {
      path: 'Things to Steal',
      component: InnovationListComponent,
    },
    {
      path: 'NEXT/folder/:id',
      component: InnovationFolderComponent,
    },
    {
      path: 'Things to Steal/folder/:id',
      component: InnovationFolderComponent,
    },
    {
      path: '10x',
      component: InnovationRemotePageComponent,
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
export class InnovationPageRoutingModule {
}
