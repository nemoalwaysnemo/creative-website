import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'knowledge',
      loadChildren: () => import('./knowledge/knowledge-page.module').then(m => m.KnowledgePageModule),
    },
    {
      path: 'creative',
      loadChildren: () => import('./creative/creative-page.module').then(m => m.CreativePageModule),
    }, {
      path: 'disruption',
      loadChildren: () => import('./disruption/disruption-page.module').then(m => m.DisruptionPageModule),
    }, {
      path: 'intelligence',
      loadChildren: () => import('./intelligence/intelligence-page.module').then(m => m.IntelligencePageModule),
    }, {
      path: 'favorite',
      loadChildren: () => import('./favorite/favorite-page.module').then(m => m.FavoritePageModule),
    }, {
      path: 'search',
      loadChildren: () => import('./global-search/global-search-page.module').then(m => m.GlobalSearchPageModule),
    }, {
      path: 'redirect',
      loadChildren: () => import('./miscellaneous/redirect/redirect.module').then(m => m.RedirectModule),
    },
    {
      path: '',
      redirectTo: 'knowledge',
      pathMatch: 'full',
    }, {
      path: 'error',
      loadChildren: () => import('./miscellaneous/miscellaneous.module').then(m => m.MiscellaneousModule),
    },
    {
      path: '**',
      loadChildren: () => import('./miscellaneous/miscellaneous.module').then(m => m.MiscellaneousModule),
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
