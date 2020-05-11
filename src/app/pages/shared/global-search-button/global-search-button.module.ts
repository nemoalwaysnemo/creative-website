import { NgModule } from '@angular/core';
import { Ng5SliderModule } from 'ng5-slider';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchButtonComponent } from './global-search-button.component';

@NgModule({
  imports: [
    ThemeModule,
    Ng5SliderModule,
  ],
  declarations: [
    GlobalSearchButtonComponent,
  ],
  exports: [
    GlobalSearchButtonComponent,
  ],
})
export class GlobalSearchButtonModule { }
