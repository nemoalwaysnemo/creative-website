import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { CreativeSearchComponent } from './creative-search.component';
import { CreativeSearchRoutingModule } from './creative-search-routing.module';
import { CreativeDocumentAssetSearchComponent } from './creative-document-asset-search/creative-document-asset-search.component';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { CreativeMyBrandSearchComponent } from './creative-my-brand-search/creative-my-brand-search.component';
import { CreativeMyBrandAssetSearchComponent } from './creative-my-brand-asset-search/creative-my-brand-asset-search.component';
import { CreativeRecommendedBrandSearchComponent } from './creative-recommended-brand-search/creative-recommended-brand-search.component';
import { CreativeRecommendedBrandAssetSearchComponent } from './creative-recommended-brand-asset-search/creative-recommended-brand-asset-search.component';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    CreativeSearchRoutingModule,
  ],
  declarations: [
    CreativeSearchComponent,
    CreativeDocumentAssetSearchComponent,
    CreativeMyBrandSearchComponent,
    CreativeMyBrandAssetSearchComponent,
    CreativeRecommendedBrandSearchComponent,
    CreativeRecommendedBrandAssetSearchComponent,
  ],
})
export class CreativeSearchModule {
}
