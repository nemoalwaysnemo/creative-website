import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { DisruptionSearchRoutingModule } from './disruption-search-routing.module';
import { DisruptionSearchComponent } from './disruption-search.component';
import { DisruptionDocumentAssetSearchComponent } from './disruption-document-asset-search/disruption-document-asset-search.component';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    DisruptionSearchRoutingModule,
  ],
  declarations: [
    DisruptionSearchComponent,
    DisruptionDocumentAssetSearchComponent,
  ],
})
export class DisruptionSearchModule {
}
