import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { AssetSearchResultComponent } from './asset/search-result.component';
import { CreativeThumbnailViewModule } from '../creative-thumbnail-view/thumbnail-view.module';
import { ListViewModule } from '../list-view/list-view.module';
import { PaginationModule } from '../pagination/pagination.module';
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
export class SearchResultModule { }
