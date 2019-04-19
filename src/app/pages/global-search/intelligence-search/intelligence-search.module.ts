import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { IntelligenceSearchRoutingModule } from './intelligence-search-routing.module';
import { IntelligenceSearchComponent } from './intelligence-search.component';
import { IntelligenceDocumentAssetSearchComponent } from './intelligence-document-asset-search/intelligence-document-asset-search.component';

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
    IntelligenceDocumentAssetSearchComponent,
  ],
})
export class IntelligenceSearchModule {
}
