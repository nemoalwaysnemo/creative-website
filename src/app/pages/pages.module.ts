import { NgModule } from '@angular/core';
import { NgPipesModule } from 'ngx-pipes';
import { ThemeModule } from '@theme/theme.module';
import { HomePageModule } from './home/home.module';
import { ListPageModule } from './list/list.module';
import { DetailPageModule } from './detail/detail.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';

const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    NgPipesModule,
    ThemeModule,
    HomePageModule,
    ListPageModule,
    DetailPageModule,
    MiscellaneousModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
})
export class PagesModule {
}
