import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeModule } from '@theme/theme.module';
import { ListViewModule } from '../list-view/list-view.module';
import { PaginationModule } from '../pagination/pagination.module';
import { GlobalSearchResultComponent } from './global-search-result.component';
import { CreativeThumbnailViewModule } from '../creative-thumbnail-view/thumbnail-view.module';
import { DocumentThumbnailViewModule } from '../document-thumbnail-view/document-thumbnail-view.module';
import { CreativeMyBrandSearchResultComponent } from './creative-my-brand-search-result/creative-my-brand-search-result.component';
import { CreativeRecommendedBrandSearchResultComponent } from './creative-recommended-brand-search-result/creative-recommended-brand-search-result.component';
import { CreativeDocumentAssetSearchResultComponent } from './creative-document-asset-search-result/creative-document-asset-search-result.component';
import { IntelligenceDocumentAssetSearchResultComponent } from './intelligence-document-asset-search-result/intelligence-document-asset-search-result.component';
import { CreativeMyBrandAssetSearchResultComponent } from './creative-my-brand-asset-search-result/creative-my-brand-asset-search-result.component';
import { DisruptionRoadmapsAssetSearchResultComponent } from './disruption-roadmaps-asset-search-result/disruption-roadmaps-asset-search-result.component';
import { DisruptionDaysAssetSearchResultComponent } from './disruption-days-asset-search-result/disruption-days-asset-search-result.component';
import { DisruptionTheoryAssetSearchResultComponent } from './disruption-theory-asset-search-result/disruption-theory-asset-search-result.component';
import { DisruptionThinkingAssetSearchResultComponent } from './disruption-thinking-asset-search-result/disruption-thinking-asset-search-result.component';
import { DisruptionFolderDayAssetSearchResultComponent } from './disruption-folder-day-asset-search-result/disruption-folder-day-asset-search-result.component';
import { IntelligenceIndustrySearchResultComponent } from './intelligence-industry-search-result/intelligence-industry-search-result.component';
import { SharedServiceModule } from '../services/shared-service.module';

const COMPONENTS = [
  GlobalSearchResultComponent,
  CreativeMyBrandSearchResultComponent,
  CreativeMyBrandAssetSearchResultComponent,
  CreativeRecommendedBrandSearchResultComponent,
  CreativeDocumentAssetSearchResultComponent,
  DisruptionDaysAssetSearchResultComponent,
  DisruptionTheoryAssetSearchResultComponent,
  DisruptionThinkingAssetSearchResultComponent,
  DisruptionRoadmapsAssetSearchResultComponent,
  DisruptionFolderDayAssetSearchResultComponent,
  IntelligenceIndustrySearchResultComponent,
  IntelligenceDocumentAssetSearchResultComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    RouterModule,
    ListViewModule,
    PaginationModule,
    DocumentThumbnailViewModule,
    CreativeThumbnailViewModule,
  ],
  declarations: [
    ...COMPONENTS,
  ],
  exports: [
    ...COMPONENTS,
  ],
  providers: [
    ...SharedServiceModule.forRoot().providers,
  ],
})
export class GlobalSearchResultModule { }
