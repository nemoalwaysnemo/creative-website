import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { GlobalSearchPageComponent } from './global-search-page.component';

const routes: Routes = [{
  path: '',
  component: GlobalSearchPageComponent,
  children: [
    {
      path: 'knowledge',
      loadChildren: () => import('./knowledge-search/knowledge-search.module').then(m => m.KnowledgeSearchModule),
    },
    {
      path: 'creative',
      loadChildren: () => import('./creative-search/creative-search.module').then(m => m.CreativeSearchModule),
    },
    {
      path: 'backslash',
      loadChildren: () => import('./backslash-search/backslash-search.module').then(m => m.BackslashSearchModule),
    },
    {
      path: 'disruption',
      loadChildren: () => import('./disruption-search/disruption-search.module').then(m => m.DisruptionSearchModule),
    },
    {
      path: 'intelligence',
      loadChildren: () => import('./intelligence-search/intelligence-search.module').then(m => m.IntelligenceSearchModule),
    },
    {
      path: 'business-development',
      loadChildren: () => import('./business-development-search/business-development-search.module').then(m => m.BusinessDevelopmentSearchModule),
    },
    {
      path: 'innovation',
      loadChildren: () => import('./innovation-search/innovation-search.module').then(m => m.InnovationSearchModule),
    },
    {
      path: 'learning',
      loadChildren: () => import('./learning-search/learning-search.module').then(m => m.LearningSearchModule),
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GlobalSearchPageRoutingModule {
}
