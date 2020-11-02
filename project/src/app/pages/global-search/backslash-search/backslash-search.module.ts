import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { BackslashSearchComponent } from './backslash-search.component';
import { BackslashSearchRoutingModule } from './backslash-search-routing.module';
import { BackslashDocumentAssetSearchComponent } from './backslash-document-asset-search/backslash-document-asset-search.component';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    BackslashSearchRoutingModule,
  ],
  declarations: [
    BackslashSearchComponent,
    BackslashDocumentAssetSearchComponent,
  ],
})
export class BackslashSearchModule {
}
