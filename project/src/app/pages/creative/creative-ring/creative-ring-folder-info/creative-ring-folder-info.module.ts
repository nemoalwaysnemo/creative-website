import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { CreativeRingFormButtonModule } from '../creative-ring-form-button/creative-ring-form-button.module';
import { GlobalSearchButtonModule } from '../../../shared/global-search-button/global-search-button.module';
import { CreativeRingInfoViewModule } from '../creative-ring-info-view/creative-ring-info-view.module';
import { CreativeRingFolderInfoComponent } from './creative-ring-folder-info.component';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    GlobalSearchButtonModule,
    CreativeRingInfoViewModule,
    CreativeRingFormButtonModule,
  ],
  declarations: [
    CreativeRingFolderInfoComponent,
  ],
  exports: [
    CreativeRingFolderInfoComponent,
  ],
})
export class CreativeRingFolderInfoModule { }
