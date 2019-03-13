import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { HomePageModule } from './home/home.module';
import { SearchPageModule } from './search/search.module';
import { BrandPageModule } from './brand/brand.module';
import { CreativePageComponent } from './creative-page.component';
import { CreativePageRoutingModule } from './creative-page-routing.module';
import { AssetPageModule } from './asset/asset.module';
import { RecommendBrandPageModule } from '@pages/creative/recommend-brand/recommend-brand.module';

@NgModule({
  imports: [
    ThemeModule,
    HomePageModule,
    SearchPageModule,
    AssetPageModule,
    BrandPageModule,
    RecommendBrandPageModule,
    AssetPageModule,
    CreativePageRoutingModule,
  ],
  declarations: [
    CreativePageComponent,
  ],
})
export class CreativePageModule {
}
