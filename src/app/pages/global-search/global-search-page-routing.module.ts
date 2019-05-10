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
    {
      path: 'disruption',
      loadChildren: './disruption-search/disruption-search.module#DisruptionSearchModule',
    },
    {
      path: 'intelligence',
      loadChildren: './intelligence-search/intelligence-search.module#IntelligenceSearchModule',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GlobalSearchPageRoutingModule {
}
