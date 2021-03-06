import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { CreativeAgencyBrandComponent } from './creative-agency-brand.component';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { CreativeAgencyInfoViewModule } from '../creative-agency-info-view/creative-agency-info-view.module';
import { CreativeAgencyFormButtonModule } from '../creative-agency-form-button/creative-agency-form-button.module';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    CreativeAgencyInfoViewModule,
    CreativeAgencyFormButtonModule,
  ],
  declarations: [
    CreativeAgencyBrandComponent,
  ],
})
export class CreativeAgencyBrandModule { }
