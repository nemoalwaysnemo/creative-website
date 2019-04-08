import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { OptionSelectModule } from '../option-select/option-select.module';
import { GlobalSearchFilterComponent } from './global-search-filter.component';

@NgModule({
  imports: [
    ThemeModule,
    OptionSelectModule,
  ],
  declarations: [
    GlobalSearchFilterComponent,
  ],
  exports: [
    GlobalSearchFilterComponent,
  ],
})
export class GlobalSearchFilterModule { }
