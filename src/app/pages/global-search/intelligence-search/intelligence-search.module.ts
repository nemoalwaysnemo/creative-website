import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { IntelligenceSearchRoutingModule } from './intelligence-search-routing.module';
import { IntelligenceSearchComponent } from './intelligence-search.component';
import { IntelligenceAssetSearchComponent } from './intelligence-asset-search/intelligence-asset-search.component';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    IntelligenceSearchRoutingModule,
  ],
  declarations: [
    IntelligenceSearchComponent,
    IntelligenceAssetSearchComponent,
  ],
})
export class IntelligenceSearchModule {
}
