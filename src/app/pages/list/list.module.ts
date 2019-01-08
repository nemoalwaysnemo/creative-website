import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { ListComponent } from './list.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { SearchResultListComponent } from './search-result/serch-result-list/search-result-list.component';
import { Ng2SmartTableModule } from '@core/custom';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    ListComponent,
    SearchFormComponent,
    SearchResultComponent,
    SearchResultListComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class ListPageModule { }
