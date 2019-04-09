import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CreativeSearchComponent } from './creative-search.component';
import { CreativeAssetSearchComponent } from './creative-asset-search/creative-asset-search.component';
import { CreativeMyBrandSearchComponent } from './creative-my-brand-search/creative-my-brand-search.component';
import { CreativeMyBrandAssetSearchComponent } from './creative-my-brand-asset-search/creative-my-brand-asset-search.component';
import { CreativeRecommendedBrandSearchComponent } from './creative-recommend-brand-search/creative-recommend-brand-search.component';
import { CreativeRecommendedBrandAssetSearchComponent } from './creative-recommend-brand-asset-search/creative-recommend-brand-asset-search.component';

const routes: Routes = [{
  path: '',
  component: CreativeSearchComponent,
  children: [
    {
      path: 'asset',
      component: CreativeAssetSearchComponent,
    },
    {
      path: 'myBrand',
      component: CreativeMyBrandSearchComponent,
    },
    {
      path: 'myBrandAsset',
      component: CreativeMyBrandAssetSearchComponent,
    },
    {
      path: 'recommendedBrand',
      component: CreativeRecommendedBrandSearchComponent,
    },
    {
      path: 'recommendedBrandAsset',
      component: CreativeRecommendedBrandAssetSearchComponent,
    },
    {
      path: '',
      component: CreativeAssetSearchComponent,
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
