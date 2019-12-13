import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { GlobalSearchButtonModule } from '@pages/shared/global-search-button/global-search-button.module';
import { CreativeBrandInfoViewModule } from '../creative-brand-info-view/creative-brand-info-view.module';
import { CreativeBrandUsageRightsComponent } from './creative-brand-usage-rights.component';

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
    CreativeBrandUsageRightsComponent,
  ],
  providers: [
  ],
})
export class CreativeBrandUsageRightsModule { }
