import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RedirectComponent, RedirectBodyComponent } from './redirect.component';

const routes: Routes = [{
  path: '',
  component: RedirectComponent,
  children: [{
    path: '',
    component: RedirectBodyComponent,
    pathMatch: 'full',
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class RedirectRoutingModule {
}
