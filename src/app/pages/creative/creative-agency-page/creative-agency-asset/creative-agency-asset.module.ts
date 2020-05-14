import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { CreativeAgencyAssetComponent } from './creative-agency-asset.component';
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
    CreativeAgencyAssetComponent,
  ],
  exports: [
    CreativeAgencyAssetComponent,
  ],
})
export class CreativeAgencyAssetModule { }
