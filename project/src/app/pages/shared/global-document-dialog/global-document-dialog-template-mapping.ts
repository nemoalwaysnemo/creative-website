import { BackslashHomeAssetDialogPreviewDialogComponent } from './document-dialog-template/backslash-home-asset-preview-dialog/backslash-home-asset-preview-dialog.component';
import { RelatedBackslashAssetDialogPreviewComponent } from './document-dialog-template/related-backslash-asset-preview-dialog/related-backslash-asset-preview-dialog.component';
import { DisruptionAssetPreviewDialogComponent } from './document-dialog-template/disruption-asset-preview-dialog/disruption-asset-preview-dialog.component';
import { DocumentConfirmationDialogComponent } from './document-dialog-template/document-confirmation-dialog/document-confirmation-dialog.component';
import { DocumentDownloadRequestDialogComponent } from './document-dialog-template/document-download-request-dialog/document-download-request-dialog.component';
import { DocumentDeletionDialogComponent } from './document-dialog-template/document-deletion-dialog/document-deletion-dialog.component';
import { CreativeProjectMgtTemplateComponent } from './document-dialog-template/creative-project-mgt-template/creative-project-mgt-template.component';
import { CreativeCampaignMgtTemplateComponent } from './document-dialog-template/creative-campaign-mgt-template/creative-campaign-mgt-template.component';
import { CreativeCollectionMgtDialogComponent } from './document-dialog-template/creative-collection-mgt-dialog/creative-collection-mgt-dialog.component';
import { InnovationAssetPreviewDialogComponent } from './document-dialog-template/innovation-asset-preview-dialog/innovation-asset-preview-dialog.component';
import { BizdevAssetPreviewDialogComponent } from './document-dialog-template/bizdev-asset-preview-dialog/bizdev-asset-preview-dialog.component';
import { IntelligenceAssetPreviewDialogComponent } from './document-dialog-template/intelligence-asset-preview-dialog/intelligence-asset-preview-dialog.component';
import { CreativeAssetPreviewDialogComponent } from './document-dialog-template/creative-asset-preview-dialog/creative-asset-preview-dialog.component';
import { DocumentShowcaseDialogComponent } from './document-dialog-template/document-showcase-dialog/document-showcase-dialog.component';
import { DocumentMultipleDeletionComponent } from './document-dialog-template/document-multiple-deletion-dialog/document-multiple-deletion-dialog.component';
import { BackslashKnowledgeAssetPreviewDialogComponent } from './document-dialog-template/backslash-knowledge-asset-preview-dialog/backslash-knowledge-asset-preview-dialog.component';
import { DisruptionXPreviewDialogComponent } from './document-dialog-template/disruption-x-preview-dialog/disruption-x-preview-dialog.component';
import { LearningProgramAlumniPreviewDialogComponent } from './document-dialog-template/learning-program-alumni-preview-dialog/learning-program-alumni-preview-dialog.component';
import { LearningProgramNominationPreviewDialogComponent } from './document-dialog-template/learning-program-nomination-preview-dialog/learning-program-nomination-preview-dialog.component';
import { RelatedBackslashReportAssetDialogPreviewComponent } from './document-dialog-template/related-backslash-report-asset-preview-dialog/related-backslash-report-asset-preview-dialog.component';
import { CreativeRingAssetPreviewDialogComponent } from './document-dialog-template/creative-ring-asset-preview-dialog/creative-ring-asset-preview-dialog.component';
export const GLOBAL_DOCUMENT_DIALOG = {
  PREVIEW_BACKSLASH_HOME_ASSET: BackslashHomeAssetDialogPreviewDialogComponent,
  PREVIEW_BACKSLASH_KNOWLEDGE_ASSET: BackslashKnowledgeAssetPreviewDialogComponent,
  PREVIEW_RELATED_BACKSLASH_ASSET: RelatedBackslashAssetDialogPreviewComponent,
  PREVIEW_RELATED_BACKSLASH_REPORT_ASSET: RelatedBackslashReportAssetDialogPreviewComponent,
  PREVIEW_RELATED_DISRUPTION_ASSET: DisruptionAssetPreviewDialogComponent,
  PREVIEW_INTELLIGENCE_ASSET: IntelligenceAssetPreviewDialogComponent,
  PREVIEW_INNOVATION_ASSET: InnovationAssetPreviewDialogComponent,
  PREVIEW_CREATIVE_ASSET: CreativeAssetPreviewDialogComponent,
  PREVIEW_CREATIVE_RING_ASSET: CreativeRingAssetPreviewDialogComponent,
  PREVIEW_BIZDEV_ASSET: BizdevAssetPreviewDialogComponent,
  PREVIEW_DISRUPTION_X: DisruptionXPreviewDialogComponent,
  PREVIEW_LEARNING_PROGRAM: LearningProgramNominationPreviewDialogComponent,
  PREVIEW_LEARNING_ALUMNI: LearningProgramAlumniPreviewDialogComponent,
  CUSTOM_DELETION: DocumentDeletionDialogComponent,
  CUSTOM_CONFIRMATION: DocumentConfirmationDialogComponent,
  CUSTOM_DELETE_MULTIPLE_ASSETS: DocumentMultipleDeletionComponent,
  CUSTOM_DOWNLOAD_REQUEST: DocumentDownloadRequestDialogComponent,
  CUSTOM_CREATIVE_PROJECT_MGT: CreativeProjectMgtTemplateComponent,
  CUSTOM_CREATIVE_CAMPAIGN_MGT: CreativeCampaignMgtTemplateComponent,
  CUSTOM_CREATIVE_COLLECTION_MGT: CreativeCollectionMgtDialogComponent,
  CUSTOM_SHOWCASE_ADD_REMOVE: DocumentShowcaseDialogComponent,
};
