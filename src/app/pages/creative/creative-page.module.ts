import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { HomePageModule } from './home/home.module';
import { ListPageModule } from './list/list.module';
import { BrandPageModule } from './brand/brand.module';
import { DetailPageModule } from './detail/detail.module';
import { CreativePageComponent } from './creative-page.component';
import { CreativePageRoutingModule } from './creative-page-routing.module';

@NgModule({
  imports: [
    ThemeModule,
    HomePageModule,
    ListPageModule,
    DetailPageModule,
    BrandPageModule,
    CreativePageRoutingModule,
  ],
  declarations: [
    CreativePageComponent,
  ],
})
export class CreativePageModule {
}
