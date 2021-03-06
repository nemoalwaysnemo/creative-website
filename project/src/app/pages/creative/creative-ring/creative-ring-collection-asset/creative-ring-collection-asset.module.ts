import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { CreativeRingCollectionAssetComponent } from './creative-ring-collection-asset.component';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { CreativeRingFormButtonModule } from '../creative-ring-form-button/creative-ring-form-button.module';
import { GlobalSearchButtonModule } from '../../../shared/global-search-button/global-search-button.module';
import { CreativeRingInfoViewModule } from '../creative-ring-info-view/creative-ring-info-view.module';
import { CreativeRingFolderInfoModule } from '../creative-ring-folder-info/creative-ring-folder-info.module';
import { DocumentShareButtonModule } from '../../../shared/document-share-button/document-share-button.module';
@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    GlobalSearchButtonModule,
    CreativeRingInfoViewModule,
    CreativeRingFormButtonModule,
    CreativeRingFolderInfoModule,
    DocumentShareButtonModule,
  ],
  declarations: [
    CreativeRingCollectionAssetComponent,
  ],
})
export class CreativeRingCollectionAssetModule { }
