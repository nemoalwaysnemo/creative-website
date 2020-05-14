import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CreativeSearchComponent } from './creative-search.component';
import { CreativeDocumentAssetSearchComponent } from './creative-document-asset-search/creative-document-asset-search.component';
import { CreativeBrandSearchComponent } from './creative-brand-search/creative-brand-search.component';
import { CreativeAgencySearchComponent } from './creative-agency-search/creative-agency-search.component';
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
      path: 'brand',
      component: CreativeBrandSearchComponent,
    },
    {
      path: 'agency',
      component: CreativeAgencySearchComponent,
    },
    {
      path: 'popularBrand',
      component: CreativePopularBrandSearchComponent,
    },
    {
      path: 'popularBrandAsset/:id',
      component: CreativePopularBrandAssetSearchComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreativeSearchRoutingModule {
}
