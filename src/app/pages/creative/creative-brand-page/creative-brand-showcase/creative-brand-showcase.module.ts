import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { CreativeBrandShowcaseComponent } from './creative-brand-showcase.component';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { GlobalSearchButtonModule } from '@pages/shared/global-search-button/global-search-button.module';
import { CreativeBrandInfoViewModule } from '../creative-brand-info-view/creative-brand-info-view.module';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    GlobalSearchButtonModule,
    CreativeBrandInfoViewModule,
  ],
  declarations: [
    CreativeBrandShowcaseComponent,
  ],
  providers: [
  ],
})
export class CreativeBrandShowcaseModule { }
