import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { ListComponent } from './list.component';
import { SearchFilterComponent } from './search-filter/search-filter.component';
import { SearchResultComponent } from './search-result/search-result.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    ListComponent,
    SearchFilterComponent,
    SearchResultComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class ListPageModule { }
