import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CommonModule } from '@angular/common';
import { CreativeBrandPageComponent } from './creative-brand-page.component';
import { CreativeBrandPageRoutingModule } from './creative-brand-page-routing.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { GlobalSearchButtonModule } from '@pages/shared/global-search-button/global-search-button.module';
import { CreativeBrandShowcaseModule } from './creative-brand-showcase/creative-brand-showcase.module';
import { CreativeBrandUsageRightsModule } from './creative-brand-usage-rights/creative-brand-usage-rights.module';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    GlobalSearchButtonModule,
    CreativeBrandShowcaseModule,
    CreativeBrandUsageRightsModule,
    CreativeBrandPageRoutingModule,
  ],
  declarations: [
    CreativeBrandPageComponent,
  ],
  providers: [
  ],
})
export class CreativeBrandPageModule { }
