import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '../../shared/shared.module';
import { SearchComponent } from './search.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { SearchResultComponent } from './search-result/search-result.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    SearchComponent,
    SearchFormComponent,
    SearchResultComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class SearchPageModule { }
