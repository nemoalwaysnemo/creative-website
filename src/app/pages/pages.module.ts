import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { HomePageModule } from './home/home.module';
import { ListPageModule } from './list/list.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { AdvanceSearchDataSource } from '@pages/shared/advance-search/advance-search-data-source.service';

const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    HomePageModule,
    ListPageModule,
    MiscellaneousModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
  providers: [
    AdvanceSearchDataSource,
  ],
})
export class PagesModule {
}
