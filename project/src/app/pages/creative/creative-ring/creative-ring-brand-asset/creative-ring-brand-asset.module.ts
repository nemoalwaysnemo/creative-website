import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { CreativeRingBrandAssetComponent } from './creative-ring-brand-asset.component';
import { DocumentRouteTabsetModule, GlobalSearchFormModule, GlobalSearchResultModule, SelectableActionBarModule } from '@pages/shared';
import { GlobalSearchButtonModule } from '../../../shared/global-search-button/global-search-button.module';
import { CreativeRingBrandCollectionViewModule } from '../creative-ring-brand-collection-view/creative-ring-brand-collection-view.module';
import { CreativeRingInfoViewModule } from '../creative-ring-info-view/creative-ring-info-view.module';
import { CreativeRingFormButtonModule } from '../creative-ring-form-button/creative-ring-form-button.module';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    GlobalSearchButtonModule,
    SelectableActionBarModule,
    CreativeRingInfoViewModule,
    CreativeRingFormButtonModule,
    DocumentRouteTabsetModule,
    CreativeRingBrandCollectionViewModule,
  ],
  declarations: [
    CreativeRingBrandAssetComponent,
  ],
})
export class CreativeRingBrandAssetModule { }
