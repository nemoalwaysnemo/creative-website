import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { CreativeBrandInfoViewComponent } from './creative-brand-info-view.component';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
  ],
  declarations: [
    CreativeBrandInfoViewComponent,
  ],
  exports: [
    CreativeBrandInfoViewComponent,
  ],
})
export class CreativeBrandInfoViewModule { }
