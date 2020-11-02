import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RedirectionComponent } from './redirection.component';

const routes: Routes = [{
  path: '',
  pathMatch: 'full',
  component: RedirectionComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class RedirectionRoutingModule {
}
