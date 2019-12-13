import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CreativeBrandFormButtonComponent } from './creative-brand-form-button.component';

@NgModule({
  imports: [
    ThemeModule,
  ],
  declarations: [
    CreativeBrandFormButtonComponent,
  ],
  exports: [
    CreativeBrandFormButtonComponent,
  ],
})
export class GlobalSearchButtonModule { }
