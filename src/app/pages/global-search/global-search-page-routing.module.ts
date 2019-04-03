import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { GlobalSearchPageComponent } from './global-search-page.component';

const routes: Routes = [{
  path: '',
  component: GlobalSearchPageComponent,
  children: [
    {
      path: 'creative',
      loadChildren: './creative-search/creative-search.module#CreativeSearchModule',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GlobalSearchPageRoutingModule {
}