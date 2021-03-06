import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
      path: 'innovation',
      loadChildren: () => import('./innovation/innovation-page.module').then(m => m.InnovationPageModule),
    },
    {
      path: 'learning',
      loadChildren: () => import('./learning/learning-page.module').then(m => m.LearningPageModule),
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
      path: '',
      redirectTo: 'knowledge',
      pathMatch: 'full',
    },
    {
      path: 'redirect',
      loadChildren: () => import('./miscellaneous/redirection/redirection.module').then(m => m.RedirectionModule),
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
