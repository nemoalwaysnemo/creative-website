import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeModule } from '@theme/theme.module';
import { PreviewDialogModule } from '../preview-dialog';
import { DocumentListViewModule } from '../document-list-view/document-list-view.module';
import { PaginationModule } from '../pagination/pagination.module';
import { SharedServiceModule } from '../services/shared-service.module';
import { DocumentViewerModule } from '../document-viewer/document-viewer.module';
import { GlobalSearchResultComponent } from './global-search-result.component';
import { DocumentThumbnailViewModule } from '../document-thumbnail-view/document-thumbnail-view.module';
import { CreativeMyBrandSearchResultComponent } from './creative-my-brand-search-result/creative-my-brand-search-result.component';
import { CreativePopularBrandSearchResultComponent, PopularBrandRowRenderComponent } from './creative-popular-brand-search-result/creative-popular-brand-search-result.component';
import { CreativeDocumentAssetSearchResultComponent, RowRenderComponent } from './creative-document-asset-search-result/creative-document-asset-search-result.component';
import { IntelligenceDocumentAssetSearchResultComponent } from './intelligence-document-asset-search-result/intelligence-document-asset-search-result.component';
import { CreativeMyBrandAssetSearchResultComponent, MyBrandRowRenderComponent } from './creative-my-brand-asset-search-result/creative-my-brand-asset-search-result.component';
import { DisruptionRoadmapsAssetSearchResultComponent } from './disruption-roadmaps-asset-search-result/disruption-roadmaps-asset-search-result.component';
import { DisruptionRoadmapEditDialogComponent } from './disruption-roadmaps-asset-search-result/disruption-roadmap-edit-form-body/disruption-roadmap-edit-dialog-body.component';
import { DisruptionThinkingEditDialogComponent } from './disruption-thinking-asset-search-result/disruption-thinking-edit-form-body/disruption-thinking-edit-dialog-body.component';
import { DisruptionDaysAssetSearchResultComponent } from './disruption-days-asset-search-result/disruption-days-asset-search-result.component';
import { DisruptionTheoryAssetSearchResultComponent } from './disruption-theory-asset-search-result/disruption-theory-asset-search-result.component';
import { DisruptionThinkingAssetSearchResultComponent } from './disruption-thinking-asset-search-result/disruption-thinking-asset-search-result.component';
import { DisruptionFolderDayAssetSearchResultComponent } from './disruption-folder-day-asset-search-result/disruption-folder-day-asset-search-result.component';
import { IntelligenceIndustrySearchResultComponent } from './intelligence-industry-search-result/intelligence-industry-search-result.component';
import { DisruptionFormRoadmapModule } from '../disruption-form-roadmap/disruption-form-roadmap.module';
import { DisruptionFormTheoryModule } from '../disruption-form-theory/disruption-form-theory.module';
import { DisruptionFormBrilliantThinkingModule } from '../disruption-form-brilliant-thinking/disruption-form-brilliant-thinking.module';
import { DisruptionDocumentAssetSearchResultComponent } from './disruption-document-asset-search-result/disruption-document-asset-search-result.component';
import { AllFavoritesAssetSearchResultComponent } from './all-favorites-asset-search-result/all-favorites-asset-search-result.component';
import { FavoriteBackslashAssetSearchResultComponent } from './favorite-backslash-asset-search-result/favorite-backslash-asset-search-result.component';
import { FavoriteBrandAssetSearchResultComponent } from './favorite-brand-asset-search-result/favorite-brand-asset-search-result.component';
import { FavoriteDisruptionAssetSearchResultComponent } from './favorite-disruption-asset-search-result/favorite-disruption-asset-search-result.component';
import { DisruptionFolderTheoryAssetSearchResultComponent } from './disruption-folder-theory-asset-search-result/disruption-folder-theory-asset-search-result.component';
import { CreativeMyAgencyAssetSearchResultComponent } from './creative-my-agency-asset-search-result/creative-my-agency-asset-search-result.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const COMPONENTS = [
  GlobalSearchResultComponent,
  CreativeMyBrandSearchResultComponent,
  CreativeMyBrandAssetSearchResultComponent,
  CreativePopularBrandSearchResultComponent,
  RowRenderComponent,
  MyBrandRowRenderComponent,
  PopularBrandRowRenderComponent,
  CreativeDocumentAssetSearchResultComponent,
  CreativeMyAgencyAssetSearchResultComponent,
  DisruptionDaysAssetSearchResultComponent,
  DisruptionTheoryAssetSearchResultComponent,
  DisruptionThinkingAssetSearchResultComponent,
  DisruptionRoadmapsAssetSearchResultComponent,
  DisruptionRoadmapEditDialogComponent,
  DisruptionThinkingEditDialogComponent,
  DisruptionFolderDayAssetSearchResultComponent,
  DisruptionFolderTheoryAssetSearchResultComponent,
  DisruptionDocumentAssetSearchResultComponent,
  IntelligenceIndustrySearchResultComponent,
  IntelligenceDocumentAssetSearchResultComponent,
  AllFavoritesAssetSearchResultComponent,
  FavoriteBackslashAssetSearchResultComponent,
  FavoriteBrandAssetSearchResultComponent,
  FavoriteDisruptionAssetSearchResultComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    RouterModule,
    DocumentListViewModule,
    PaginationModule,
    PreviewDialogModule,
    DocumentViewerModule,
    DocumentThumbnailViewModule,
    DisruptionFormRoadmapModule,
    DisruptionFormTheoryModule,
    DisruptionFormBrilliantThinkingModule,
    InfiniteScrollModule,
  ],
  entryComponents: [
    RowRenderComponent,
    MyBrandRowRenderComponent,
    PopularBrandRowRenderComponent,
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
