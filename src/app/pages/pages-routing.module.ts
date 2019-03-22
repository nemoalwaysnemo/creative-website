import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'creative',
      loadChildren: './creative/creative-page.module#CreativePageModule',
    }, {
      path: 'disruption',
      loadChildren: './disruption/disruption-page.module#DisruptionPageModule',
    }, {
      path: 'intelligence',
      loadChildren: './intelligence/intelligence-page.module#IntelligencePageModule',
    }, {
      path: 'search',
      loadChildren: './global-search/global-search-page.module#GlobalSearchPageModule',
    }, {
      path: '',
      redirectTo: 'creative',
      pathMatch: 'full',
    }, {
      path: 'error',
      loadChildren: './miscellaneous/miscellaneous.module#MiscellaneousModule',
    },
    {
      path: '**',
      loadChildren: './miscellaneous/miscellaneous.module#MiscellaneousModule',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
