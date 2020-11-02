import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { CreativeBrandUsageRightsComponent } from './creative-brand-usage-rights.component';
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
    CreativeBrandUsageRightsComponent,
  ],
})
export class CreativeBrandUsageRightsModule { }
