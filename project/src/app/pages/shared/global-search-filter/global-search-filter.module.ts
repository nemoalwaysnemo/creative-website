import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { NbDatepickerModule } from '@core/nebular/theme';
import { OptionSelectModule } from '../option-select/option-select.module';
import { GlobalSearchFilterComponent } from './global-search-filter.component';

@NgModule({
  imports: [
    ThemeModule,
    OptionSelectModule,
    NbDatepickerModule.forRoot(),
  ],
  declarations: [
    GlobalSearchFilterComponent,
  ],
  exports: [
    GlobalSearchFilterComponent,
  ],
})
export class GlobalSearchFilterModule { }
