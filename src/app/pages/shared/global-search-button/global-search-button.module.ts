import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { OptionSelectModule } from '../option-select/option-select.module';
import { GlobalSearchButtonComponent } from './global-search-button.component';

@NgModule({
  imports: [
    ThemeModule,
  ],
  declarations: [
    GlobalSearchButtonComponent,
  ],
  exports: [
    GlobalSearchButtonComponent,
  ],
})
export class GlobalSearchButtonModule { }
