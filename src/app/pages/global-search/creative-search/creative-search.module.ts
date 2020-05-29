import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { CreativeSearchComponent } from './creative-search.component';
import { CreativeSearchRoutingModule } from './creative-search-routing.module';
import { CreativeDocumentAssetSearchComponent } from './creative-document-asset-search/creative-document-asset-search.component';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { CreativeBrandSearchComponent } from './creative-brand-search/creative-brand-search.component';
import { CreativeAgencySearchComponent } from './creative-agency-search/creative-agency-search.component';
import { CreativePopularBrandSearchComponent } from './creative-popular-brand-search/creative-popular-brand-search.component';
import { CreativePopularBrandAssetSearchComponent } from './creative-popular-brand-asset-search/creative-popular-brand-asset-search.component';
import { GlobalSearchButtonModule } from '../../shared/global-search-button/global-search-button.module';

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
    CreativeBrandSearchComponent,
    CreativeAgencySearchComponent,
    CreativeDocumentAssetSearchComponent,
    CreativePopularBrandSearchComponent,
    CreativePopularBrandAssetSearchComponent,

  ],
})
export class CreativeSearchModule {
}
