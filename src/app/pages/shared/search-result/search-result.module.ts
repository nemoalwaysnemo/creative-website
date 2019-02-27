import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { AssetSearchResultComponent } from '@pages/shared/search-result/asset/search-result.component';
import { CreativeThumbnailViewModule, ListViewModule, PaginationModule } from '@pages/shared';
import { BrandSearchResultComponent } from '@pages/shared/search-result/brand/search-result.component';


@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    CreativeThumbnailViewModule,
    ListViewModule,
    PaginationModule,
  ],
  declarations: [
    AssetSearchResultComponent,
    BrandSearchResultComponent,
  ],
  exports: [
    AssetSearchResultComponent,
    BrandSearchResultComponent,
  ],
})
export class SearchResultModule {}
