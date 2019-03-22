import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CreativeSearchComponent } from './creative-search.component';
import { CreativeGlobalSearchComponent } from './creative-global-search/creative-global-search.component';

const routes: Routes = [{
  path: '',
  component: CreativeSearchComponent,
  children: [
    {
      path: 'global',
      component: CreativeGlobalSearchComponent,
    },
    {
      path: '',
      component: CreativeGlobalSearchComponent,
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreativeSearchRoutingModule {
}
