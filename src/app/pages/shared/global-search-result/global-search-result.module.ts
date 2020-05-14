import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeModule } from '@theme/theme.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PaginationModule } from '../pagination/pagination.module';
import { GlobalSearchResultComponent } from './global-search-result.component';
import { DocumentViewerModule } from '../document-viewer/document-viewer.module';
import { DocumentListViewModule } from '../document-list-view/document-list-view.module';
import { DocumentThumbnailViewModule } from '../document-thumbnail-view/document-thumbnail-view.module';
import { CreativePopularBrandSearchResultComponent, CreativePopularBrandRowRenderComponent } from './creative-popular-brand-search-result/creative-popular-brand-search-result.component';
import { CreativeUsageRightsSearchResultComponent } from './creative-usage-rights-search-result/creative-usage-rights-search-result.component';
import { CreativeBrandCampaignSearchResultComponent } from './creative-brand-campaign-search-result/creative-brand-campaign-search-result.component';
import { CreativeBrandProjectSearchResultComponent } from './creative-brand-project-search-result/creative-brand-project-search-result.component';
import { CreativeDocumentAssetSearchResultComponent, CreativeDocumentAssetRowRenderComponent } from './creative-document-asset-search-result/creative-document-asset-search-result.component';
import { IntelligenceDocumentAssetSearchResultComponent } from './intelligence-document-asset-search-result/intelligence-document-asset-search-result.component';
import { CreativeBrandAssetSearchResultComponent, CreativeBrandRowRenderComponent } from './creative-brand-asset-search-result/creative-brand-asset-search-result.component';
import { DisruptionRoadmapsAssetSearchResultComponent } from './disruption-roadmaps-asset-search-result/disruption-roadmaps-asset-search-result.component';
import { DisruptionDaysAssetSearchResultComponent } from './disruption-days-asset-search-result/disruption-days-asset-search-result.component';
import { DisruptionTheoryAssetSearchResultComponent } from './disruption-theory-asset-search-result/disruption-theory-asset-search-result.component';
import { DisruptionThinkingAssetSearchResultComponent } from './disruption-thinking-asset-search-result/disruption-thinking-asset-search-result.component';
import { DisruptionFolderDayAssetSearchResultComponent } from './disruption-folder-day-asset-search-result/disruption-folder-day-asset-search-result.component';
import { IntelligenceIndustrySearchResultComponent } from './intelligence-industry-search-result/intelligence-industry-search-result.component';
import { DisruptionDocumentAssetSearchResultComponent } from './disruption-document-asset-search-result/disruption-document-asset-search-result.component';
import { DisruptionFolderTheoryAssetSearchResultComponent } from './disruption-folder-theory-asset-search-result/disruption-folder-theory-asset-search-result.component';
import { CreativeAgencyAssetSearchResultComponent } from './creativ-agency-asset-search-result/creative-agency-asset-search-result.component';
import { AllFavoritesAssetSearchResultComponent } from './all-favorites-asset-search-result/all-favorites-asset-search-result.component';
import { FavoriteBackslashAssetSearchResultComponent } from './favorite-backslash-asset-search-result/favorite-backslash-asset-search-result.component';
import { FavoriteBrandAssetSearchResultComponent } from './favorite-brand-asset-search-result/favorite-brand-asset-search-result.component';
import { FavoriteDisruptionAssetSearchResultComponent } from './favorite-disruption-asset-search-result/favorite-disruption-asset-search-result.component';
import { BackslashDocumentAssetSearchResultComponent } from './backslash-document-asset-search-result/backslash-document-asset-search-result.component';
import { BizDevCaseStudyAssetSearchResultComponent } from './biz-dev-case-study-asset-search-result/biz-dev-case-study-asset-search-result.component';
import { BizDevCaseStudyFolderAssetSearchResultComponent } from './biz-dev-case-study-folder-asset-search-result/biz-dev-case-study-folder-asset-search-result.component';
import { BizDevThoughtLeadershipAssetSearchResultComponent } from './biz-dev-thought-leadership-asset-search-result/biz-dev-thought-leadership-asset-search-result.component';
import { BizDevThoughtLeadershipFolderAssetSearchResultComponent } from './biz-dev-thought-leadership-folder-asset-search-result/biz-dev-thought-leadership-folder-asset-search-result.component';
import { BizDevDocumentAssetSearchResultComponent } from './biz-dev-document-asset-search-result/biz-dev-document-asset-search-result.component';
import { GlobalDocumentDialogModule } from '../global-document-dialog/global-document-dialog.module';

const COMPONENTS = [
  GlobalSearchResultComponent,
  CreativeBrandAssetSearchResultComponent,
  CreativePopularBrandSearchResultComponent,
  CreativeBrandRowRenderComponent,
  CreativeDocumentAssetRowRenderComponent,
  CreativePopularBrandRowRenderComponent,
  CreativeUsageRightsSearchResultComponent,
  CreativeBrandCampaignSearchResultComponent,
  CreativeBrandProjectSearchResultComponent,
  CreativeDocumentAssetSearchResultComponent,
  CreativeAgencyAssetSearchResultComponent,
  BackslashDocumentAssetSearchResultComponent,
  DisruptionDaysAssetSearchResultComponent,
  DisruptionTheoryAssetSearchResultComponent,
  DisruptionThinkingAssetSearchResultComponent,
  DisruptionRoadmapsAssetSearchResultComponent,
  DisruptionFolderDayAssetSearchResultComponent,
  DisruptionFolderTheoryAssetSearchResultComponent,
  DisruptionDocumentAssetSearchResultComponent,
  IntelligenceIndustrySearchResultComponent,
  IntelligenceDocumentAssetSearchResultComponent,
  BizDevDocumentAssetSearchResultComponent,
  BizDevCaseStudyAssetSearchResultComponent,
  BizDevCaseStudyFolderAssetSearchResultComponent,
  BizDevThoughtLeadershipAssetSearchResultComponent,
  BizDevThoughtLeadershipFolderAssetSearchResultComponent,
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
    PaginationModule,
    InfiniteScrollModule,
    DocumentViewerModule,
    DocumentListViewModule,
    DocumentThumbnailViewModule,
    GlobalDocumentDialogModule,
  ],
  entryComponents: [
    CreativeDocumentAssetRowRenderComponent,
    CreativeBrandRowRenderComponent,
    CreativePopularBrandRowRenderComponent,
  ],
  declarations: [
    ...COMPONENTS,
  ],
  exports: [
    ...COMPONENTS,
    GlobalDocumentDialogModule,
  ],
})
export class GlobalSearchResultModule { }
