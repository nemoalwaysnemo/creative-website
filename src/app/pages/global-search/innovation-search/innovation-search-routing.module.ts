import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { InnovationSearchComponent } from './innovation-search.component';
import { InnovationAssetSearchComponent } from './innovation-document-asset-search/innovation-asset-search.component';

const routes: Routes = [{
  path: '',
  component: InnovationSearchComponent,
  children: [
    {
      path: 'asset',
      component: InnovationAssetSearchComponent,
    },
    {
      path: '',
      redirectTo: 'asset',
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InnovationSearchRoutingModule {
}
