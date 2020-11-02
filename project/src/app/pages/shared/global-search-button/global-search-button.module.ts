import { NgModule } from '@angular/core';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchButtonComponent } from './global-search-button.component';

@NgModule({
  imports: [
    ThemeModule,
    NgxSliderModule,
  ],
  declarations: [
    GlobalSearchButtonComponent,
  ],
  exports: [
    GlobalSearchButtonComponent,
  ],
})
export class GlobalSearchButtonModule { }
