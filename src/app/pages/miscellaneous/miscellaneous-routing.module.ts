import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MiscellaneousComponent } from './miscellaneous.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PlaygroundComponent } from './playground/playground.component';
import { RedirectComponent } from '@pages/miscellaneous/redirect/redirect.component';

const routes: Routes = [{
  path: '',
  component: MiscellaneousComponent,
  children: [
    {
      path: '404',
      component: NotFoundComponent,
    },
    {
      path: 'playground',
      component: PlaygroundComponent,
    },
    {
      path: '',
      component: NotFoundComponent,
      pathMatch: 'full',
    },
    {
      path: 'redirect',
      component: RedirectComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MiscellaneousRoutingModule { }

export const routedComponents = [
  MiscellaneousComponent,
  PlaygroundComponent,
  NotFoundComponent,
];
