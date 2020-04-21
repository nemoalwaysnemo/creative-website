import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'creative',
      loadChildren: () => import('./creative/creative-page.module').then(m => m.CreativePageModule),
    },
    {
      path: 'backslash',
      loadChildren: () => import('./backslash/backslash-page.module').then(m => m.BackslashPageModule),
    },
    {
      path: 'disruption',
      loadChildren: () => import('./disruption/disruption-page.module').then(m => m.DisruptionPageModule),
    },
    {
      path: 'intelligence',
      loadChildren: () => import('./intelligence/intelligence-page.module').then(m => m.IntelligencePageModule),
    },
    {
      path: 'business-development',
      loadChildren: () => import('./business-development/business-development-page.module').then(m => m.BusinessDevelopmentPageModule),
    },
    {
      path: 'search',
      loadChildren: () => import('./global-search/global-search-page.module').then(m => m.GlobalSearchPageModule),
    },
    {
      path: 'favorite',
      loadChildren: () => import('./favorite/favorite-page.module').then(m => m.FavoritePageModule),
    },
    {
      path: 'redirect',
      loadChildren: () => import('./miscellaneous/redirect/redirect.module').then(m => m.RedirectModule),
    },
    {
      path: '',
      redirectTo: 'creative',
      pathMatch: 'full',
    },
    {
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
