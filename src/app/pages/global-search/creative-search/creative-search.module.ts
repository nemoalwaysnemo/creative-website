import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { CreativeSearchComponent } from './creative-search.component';
import { CreativeSearchRoutingModule } from './creative-search-routing.module';
import { CreativeAssetSearchComponent } from './creative-asset-search/creative-asset-search.component';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { CreativeMyBrandSearchComponent } from './creative-my-brand-search/creative-my-brand-search.component';
import { CreativeRecommendedBrandSearchComponent } from './creative-recommend-brand-search/creative-recommend-brand-search.component';


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
    CreativeAssetSearchComponent,
    CreativeMyBrandSearchComponent,
    CreativeRecommendedBrandSearchComponent,
  ],
})
export class CreativeSearchModule {
}
