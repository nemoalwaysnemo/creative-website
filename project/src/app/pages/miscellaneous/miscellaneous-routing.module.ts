import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MiscellaneousComponent } from './miscellaneous.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { PlaygroundComponent } from './playground/playground.component';
import { PermissionDeniedComponent } from './permission-denied/permission-denied.component';

const routes: Routes = [{
  path: '',
  component: MiscellaneousComponent,
  children: [
    {
      path: '403',
      component: PermissionDeniedComponent,
    },
    {
      path: '404',
      component: NotFoundComponent,
    },
    {
      path: '500',
      component: ServerErrorComponent,
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
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MiscellaneousRoutingModule { }
