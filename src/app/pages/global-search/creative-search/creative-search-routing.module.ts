import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CreativeSearchComponent } from './creative-search.component';
import { CreativeDocumentAssetSearchComponent } from './creative-document-asset-search/creative-document-asset-search.component';
import { CreativeMyBrandSearchComponent } from './creative-my-brand-search/creative-my-brand-search.component';
import { CreativeMyBrandAssetSearchComponent } from './creative-my-brand-asset-search/creative-my-brand-asset-search.component';
import { CreativePopularBrandSearchComponent } from './creative-popular-brand-search/creative-popular-brand-search.component';
import { CreativePopularBrandAssetSearchComponent } from './creative-popular-brand-asset-search/creative-popular-brand-asset-search.component';

const routes: Routes = [{
  path: '',
  component: CreativeSearchComponent,
  children: [
    {
      path: 'asset',
      component: CreativeDocumentAssetSearchComponent,
    },
    {
      path: 'myBrand',
      component: CreativeMyBrandSearchComponent,
    },
    {
      path: 'myBrandAsset/:id',
      component: CreativeMyBrandAssetSearchComponent,
    },
    {
      path: 'popularBrand',
      component: CreativePopularBrandSearchComponent,
    },
    {
      path: 'popularBrandAsset/:id',
      component: CreativePopularBrandAssetSearchComponent,
    },
    {
      path: '',
      component: CreativeDocumentAssetSearchComponent,
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreativeSearchRoutingModule {
}
