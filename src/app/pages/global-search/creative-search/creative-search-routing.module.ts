import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CreativeSearchComponent } from './creative-search.component';
import { CreativeDocumentAssetSearchComponent } from './creative-document-asset-search/creative-document-asset-search.component';
import { CreativeMyBrandSearchComponent } from './creative-my-brand-search/creative-my-brand-search.component';
import { CreativeMyBrandAssetSearchComponent } from './creative-my-brand-asset-search/creative-my-brand-asset-search.component';
import { CreativeRecommendedBrandSearchComponent } from './creative-recommended-brand-search/creative-recommended-brand-search.component';
import { CreativeRecommendedBrandAssetSearchComponent } from './creative-recommended-brand-asset-search/creative-recommended-brand-asset-search.component';

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
      path: 'recommendedBrand',
      component: CreativeRecommendedBrandSearchComponent,
    },
    {
      path: 'recommendedBrandAsset/:id',
      component: CreativeRecommendedBrandAssetSearchComponent,
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
