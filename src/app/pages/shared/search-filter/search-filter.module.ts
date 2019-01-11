import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SearchFilterComponent } from './search-filter.component';
import { OptionSelectModule } from '../option-select/option-select.module';

@NgModule({
  imports: [
    ThemeModule,
    OptionSelectModule,
  ],
  declarations: [
    SearchFilterComponent,
  ],
  exports: [
    SearchFilterComponent,
  ],
})
export class SearchFilterModule { }
