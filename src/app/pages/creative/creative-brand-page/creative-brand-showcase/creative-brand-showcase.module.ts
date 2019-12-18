import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { CreativeBrandShowcaseComponent } from './creative-brand-showcase.component';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { CreativeBrandInfoViewModule } from '../creative-brand-info-view/creative-brand-info-view.module';
import { CreativeBrandFormButtonModule } from '../creative-brand-form-button/creative-brand-form-button.module';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    CreativeBrandInfoViewModule,
    CreativeBrandFormButtonModule,
  ],
  declarations: [
    CreativeBrandShowcaseComponent,
  ],
  providers: [
  ],
})
export class CreativeBrandShowcaseModule { }
