import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { CreativeRingBrandComponent } from './creative-ring-brand.component';
import { DocumentRouteTabsetModule, GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { CreativeRingFormButtonModule } from '../creative-ring-form-button/creative-ring-form-button.module';
import { GlobalSearchButtonModule } from '../../../shared/global-search-button/global-search-button.module';
import { CreativeRingInfoViewModule } from '../creative-ring-info-view/creative-ring-info-view.module';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    GlobalSearchButtonModule,
    CreativeRingInfoViewModule,
    CreativeRingFormButtonModule,
    DocumentRouteTabsetModule,
  ],
  declarations: [
    CreativeRingBrandComponent,
  ],
})
export class CreativeRingBrandModule { }
