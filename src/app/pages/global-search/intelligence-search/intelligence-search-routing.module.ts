import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { IntelligenceSearchComponent } from './intelligence-search.component';
import { IntelligenceDocumentAssetSearchComponent } from './intelligence-document-asset-search/intelligence-document-asset-search.component';

const routes: Routes = [{
  path: '',
  component: IntelligenceSearchComponent,
  children: [
    {
      path: 'asset/:id',
      component: IntelligenceDocumentAssetSearchComponent,
    },
    {
      path: '',
      component: IntelligenceDocumentAssetSearchComponent,
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntelligenceSearchRoutingModule {
}
