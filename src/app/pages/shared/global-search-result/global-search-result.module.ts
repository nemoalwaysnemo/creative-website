import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeModule } from '@theme/theme.module';
import { PreviewDialogModule } from '../preview-dialog';
import { ListViewModule } from '../list-view/list-view.module';
import { PaginationModule } from '../pagination/pagination.module';
import { SharedServiceModule } from '../services/shared-service.module';
import { DocumentViewerModule } from '../document-viewer/document-viewer.module';
import { GlobalSearchResultComponent } from './global-search-result.component';
import { DocumentThumbnailViewModule } from '../document-thumbnail-view/document-thumbnail-view.module';
import { CreativeMyBrandSearchResultComponent } from './creative-my-brand-search-result/creative-my-brand-search-result.component';
import { CreativePopularBrandSearchResultComponent } from './creative-popular-brand-search-result/creative-popular-brand-search-result.component';
import { CreativeDocumentAssetSearchResultComponent } from './creative-document-asset-search-result/creative-document-asset-search-result.component';
import { IntelligenceDocumentAssetSearchResultComponent } from './intelligence-document-asset-search-result/intelligence-document-asset-search-result.component';
import { CreativeMyBrandAssetSearchResultComponent } from './creative-my-brand-asset-search-result/creative-my-brand-asset-search-result.component';
import { DisruptionRoadmapsAssetSearchResultComponent } from './disruption-roadmaps-asset-search-result/disruption-roadmaps-asset-search-result.component';
import { DisruptionRoadmapEditDialogComponent } from './disruption-roadmaps-asset-search-result/disruption-roadmap-edit-form-body/disruption-roadmap-edit-dialog-body.component';
import { DisruptionTheoryEditDialogComponent } from './disruption-theory-asset-search-result/disruption-theory-edit-form-body/disruption-theory-edit-dialog-body.component';
import { DisruptionThinkingEditDialogComponent } from './disruption-thinking-asset-search-result/disruption-thinking-edit-form-body/disruption-thinking-edit-dialog-body.component';
import { DisruptionDaysAssetSearchResultComponent } from './disruption-days-asset-search-result/disruption-days-asset-search-result.component';
import { DisruptionTheoryAssetSearchResultComponent } from './disruption-theory-asset-search-result/disruption-theory-asset-search-result.component';
import { DisruptionThinkingAssetSearchResultComponent } from './disruption-thinking-asset-search-result/disruption-thinking-asset-search-result.component';
import { DisruptionFolderDayAssetSearchResultComponent } from './disruption-folder-day-asset-search-result/disruption-folder-day-asset-search-result.component';
import { IntelligenceIndustrySearchResultComponent } from './intelligence-industry-search-result/intelligence-industry-search-result.component';
import { DisruptionFormRoadmapModule } from '../disruption-form-roadmap/disruption-form-roadmap.module';
import { DisruptionFormTheoryModule } from '../disruption-form-theory/disruption-form-theory.module';
import { DisruptionFormBrilliantThinkingModule } from '../disruption-form-brilliant-thinking/disruption-form-brilliant-thinking.module';

const COMPONENTS = [
  GlobalSearchResultComponent,
  CreativeMyBrandSearchResultComponent,
  CreativeMyBrandAssetSearchResultComponent,
  CreativePopularBrandSearchResultComponent,
  CreativeDocumentAssetSearchResultComponent,
  DisruptionDaysAssetSearchResultComponent,
  DisruptionTheoryAssetSearchResultComponent,
  DisruptionThinkingAssetSearchResultComponent,
  DisruptionRoadmapsAssetSearchResultComponent,
  DisruptionRoadmapEditDialogComponent,
  DisruptionTheoryEditDialogComponent,
  DisruptionThinkingEditDialogComponent,
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
    PreviewDialogModule,
    DocumentViewerModule,
    DocumentThumbnailViewModule,
    DisruptionFormRoadmapModule,
    DisruptionFormTheoryModule,
    DisruptionFormBrilliantThinkingModule,
  ],
  declarations: [
    ...COMPONENTS,
  ],
  exports: [
    ...COMPONENTS,
  ],
  providers: [
    ...PreviewDialogModule.forRoot().providers,
    ...SharedServiceModule.forRoot().providers,
  ],
})
export class GlobalSearchResultModule { }
