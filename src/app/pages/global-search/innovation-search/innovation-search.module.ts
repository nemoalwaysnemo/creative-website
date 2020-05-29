import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { InnovationSearchComponent } from './innovation-search.component';
import { InnovationSearchRoutingModule } from './innovation-search-routing.module';
import { InnovationAssetSearchComponent } from './innovation-document-asset-search/innovation-asset-search.component';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    InnovationSearchRoutingModule,
  ],
  declarations: [
    InnovationSearchComponent,
    InnovationAssetSearchComponent,
  ],
})
export class InnovationSearchModule {
}
