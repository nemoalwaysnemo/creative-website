import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { InnovationSearchComponent } from './innovation-search.component';
import { InnovationDocumentAssetSearchComponent  } from './innovation-document-asset-search/innovation-document-asset-search.component';

const routes: Routes = [{
  path: '',
  component: InnovationSearchComponent,
  children: [
    {
      path: 'asset',
      component: InnovationDocumentAssetSearchComponent ,
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
