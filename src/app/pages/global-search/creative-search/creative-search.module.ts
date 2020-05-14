import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { CreativeSearchComponent } from './creative-search.component';
import { CreativeSearchRoutingModule } from './creative-search-routing.module';
import { CreativeDocumentAssetSearchComponent } from './creative-document-asset-search/creative-document-asset-search.component';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { CreativeMyBrandSearchComponent } from './creative-my-brand-search/creative-my-brand-search.component';
import { CreativePopularBrandSearchComponent } from './creative-popular-brand-search/creative-popular-brand-search.component';
import { CreativePopularBrandAssetSearchComponent } from './creative-popular-brand-asset-search/creative-popular-brand-asset-search.component';
import { CreativeMyAgencyAssetSearchComponent } from './creative-my-agency-asset-search/creative-my-agency-asset-search.component';
import { GlobalSearchButtonModule } from '@pages/shared/global-search-button/global-search-button.module';
import { CreativeMyAgencySearchComponent } from './creative-my-agency-search/creative-my-agency-search.component';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    GlobalSearchButtonModule,
    CreativeSearchRoutingModule,
  ],
  declarations: [
    CreativeSearchComponent,
    CreativeDocumentAssetSearchComponent,
    CreativeMyBrandSearchComponent,
    CreativePopularBrandSearchComponent,
    CreativePopularBrandAssetSearchComponent,
    CreativeMyAgencyAssetSearchComponent,
    CreativeMyAgencySearchComponent,

  ],
})
export class CreativeSearchModule {
}
