import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { AssetSearchResultComponent } from './asset/asset-search-result.component';
import { CreativeThumbnailViewModule } from '../creative-thumbnail-view/thumbnail-view.module';
import { ListViewModule } from '../list-view/list-view.module';
import { PaginationModule } from '../pagination/pagination.module';
import { MyBrandSearchResultComponent } from './my-brand/my-brand-search-result.component';
import { RecommendBrandSearchResultComponent } from './recommend-brand/recommend-brand-search-result.component';


@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    ListViewModule,
    PaginationModule,
    CreativeThumbnailViewModule,
  ],
  declarations: [
    AssetSearchResultComponent,
    MyBrandSearchResultComponent,
    RecommendBrandSearchResultComponent,
  ],
  exports: [
    AssetSearchResultComponent,
    MyBrandSearchResultComponent,
    RecommendBrandSearchResultComponent,
  ],
})
export class GlobalSearchResultModule { }
