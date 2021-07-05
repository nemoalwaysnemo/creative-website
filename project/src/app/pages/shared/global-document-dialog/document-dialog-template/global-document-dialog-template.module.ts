import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DocumentFormModule } from '../../document-form/document-form.module';
import { DocumentViewerModule } from '../../document-viewer/document-viewer.module';
import { DocumentCreativeProjectMgtModule } from '../../document-creative-project-mgt';
import { DocumentCreativeCampaignMgtModule } from '../../document-creative-campaign-mgt';
import { DocumentShareButtonModule } from '../../document-share-button/document-share-button.module';
import { DocumentBackslashInfoModule } from '../../document-backslash-info/document-backslash-info.module';
import { DisruptionAssetPreviewDialogComponent } from './disruption-asset-preview-dialog/disruption-asset-preview-dialog.component';
import { DocumentDeletionDialogComponent } from './document-deletion-dialog/document-deletion-dialog.component';
import { BackslashHomeAssetDialogPreviewDialogComponent } from './backslash-home-asset-preview-dialog/backslash-home-asset-preview-dialog.component';
import { RelatedBackslashAssetDialogPreviewComponent } from './related-backslash-asset-preview-dialog/related-backslash-asset-preview-dialog.component';
import { RelatedBackslashReportAssetDialogPreviewComponent } from './related-backslash-report-asset-preview-dialog/related-backslash-report-asset-preview-dialog.component';
import { DocumentConfirmationDialogComponent } from './document-confirmation-dialog/document-confirmation-dialog.component';
import { DocumentDownloadRequestDialogComponent } from './document-download-request-dialog/document-download-request-dialog.component';
import { CreativeProjectMgtTemplateComponent } from './creative-project-mgt-template/creative-project-mgt-template.component';
import { CreativeCampaignMgtTemplateComponent } from './creative-campaign-mgt-template/creative-campaign-mgt-template.component';
import { InnovationAssetPreviewDialogComponent } from './innovation-asset-preview-dialog/innovation-asset-preview-dialog.component';
import { BizdevAssetPreviewDialogComponent } from './bizdev-asset-preview-dialog/bizdev-asset-preview-dialog.component';
import { IntelligenceAssetPreviewDialogComponent } from './intelligence-asset-preview-dialog/intelligence-asset-preview-dialog.component';
import { CreativeAssetPreviewDialogComponent } from './creative-asset-preview-dialog/creative-asset-preview-dialog.component';
import { CreativeRingAssetPreviewDialogComponent } from './creative-ring-asset-preview-dialog/creative-ring-asset-preview-dialog.component';
import { DocumentShowcaseDialogComponent } from './document-showcase-dialog/document-showcase-dialog.component';
import { DocumentMultipleDeletionComponent } from './document-multiple-deletion-dialog/document-multiple-deletion-dialog.component';
import { KnowledgeRelatedInfoModule } from '../../knowledge-related-info-view/knowledge-related-info.module';
import { ListSearchFormInDialogModule } from '../../list-search-form-in-dialog/list-search-form-in-dialog.module';
import { DocumentUsageRightsStatusModule } from '../../document-usage-rights-status/document-usage-rights-status.module';
import { BackslashKnowledgeAssetPreviewDialogComponent } from './backslash-knowledge-asset-preview-dialog/backslash-knowledge-asset-preview-dialog.component';
import { DisruptionXPreviewDialogComponent } from './disruption-x-preview-dialog/disruption-x-preview-dialog.component';
import { DocumentNewPosterButtonModule } from '../../document-new-poster-button/document-new-poster-button.module';
import { LearningProgramAlumniPreviewDialogComponent } from './learning-program-alumni-preview-dialog/learning-program-alumni-preview-dialog.component';
import { LearningProgramNominationPreviewDialogComponent } from './learning-program-nomination-preview-dialog/learning-program-nomination-preview-dialog.component';
import { CreativeCollectionMgtDialogModule } from './creative-collection-mgt-dialog/creative-collection-mgt-dialog.module';

const COMPONENTS = [
  BizdevAssetPreviewDialogComponent,
  BackslashKnowledgeAssetPreviewDialogComponent,
  BackslashHomeAssetDialogPreviewDialogComponent,
  RelatedBackslashAssetDialogPreviewComponent,
  RelatedBackslashReportAssetDialogPreviewComponent,
  DisruptionAssetPreviewDialogComponent,
  DisruptionXPreviewDialogComponent,
  DocumentConfirmationDialogComponent,
  DocumentDeletionDialogComponent,
  DocumentDownloadRequestDialogComponent,
  CreativeAssetPreviewDialogComponent,
  CreativeRingAssetPreviewDialogComponent,
  CreativeProjectMgtTemplateComponent,
  CreativeCampaignMgtTemplateComponent,
  InnovationAssetPreviewDialogComponent,
  IntelligenceAssetPreviewDialogComponent,
  DocumentShowcaseDialogComponent,
  DocumentMultipleDeletionComponent,
  LearningProgramNominationPreviewDialogComponent,
  LearningProgramAlumniPreviewDialogComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    ReactiveFormsModule,
    DocumentFormModule,
    DocumentViewerModule,
    DocumentShareButtonModule,
    KnowledgeRelatedInfoModule,
    DocumentBackslashInfoModule,
    ListSearchFormInDialogModule,
    DocumentNewPosterButtonModule,
    DocumentUsageRightsStatusModule,
    DocumentCreativeProjectMgtModule,
    DocumentCreativeCampaignMgtModule,
    CreativeCollectionMgtDialogModule,
  ],
  declarations: [
    ...COMPONENTS,
  ],
  exports: [
    ...COMPONENTS,
  ],
})
export class GlobalDocumentDialogTemplateModule {

}
