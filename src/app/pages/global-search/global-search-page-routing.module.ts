import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { GlobalSearchPageComponent } from './global-search-page.component';

const routes: Routes = [{
  path: '',
  component: GlobalSearchPageComponent,
  children: [
    {
      path: 'creative',
      loadChildren: () => import('./creative-search/creative-search.module').then(m => m.CreativeSearchModule),
    },
    {
      path: 'disruption',
      loadChildren: () => import('./disruption-search/disruption-search.module').then(m => m.DisruptionSearchModule),
    },
    {
      path: 'intelligence',
      loadChildren: () => import('./intelligence-search/intelligence-search.module').then(m => m.IntelligenceSearchModule),
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GlobalSearchPageRoutingModule {
}
