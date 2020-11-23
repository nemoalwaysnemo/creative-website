import { BackslashHomeAssetDialogPreviewComponent } from './document-dialog-template/backslash-home-asset-preview/backslash-home-asset-preview.component';
import { RelatedBackslashAssetDialogPreviewComponent } from './document-dialog-template/related-backslash-asset-preview/related-backslash-asset-preview.component';
import { DisruptionAssetPreviewDialogComponent } from './document-dialog-template/disruption-asset-preview/disruption-asset-preview.component';
import { DocumentDialogConfirmationTemplateComponent } from './document-dialog-template/document-confirmation-template/document-confirmation-template.component';
import { DocumentDownloadRequestTemplateComponent } from './document-dialog-template/document-download-request-template/document-download-request-template.component';
import { DocumentDialogDeletionTemplateComponent } from './document-dialog-template/document-deletion-template/document-deletion-template.component';
import { CreativeProjectAssetTemplateComponent } from './document-dialog-template/creative-project-asset-template/creative-project-asset-template.component';
import { InnovationAssetPreviewDialogComponent } from './document-dialog-template/innovation-asset-preview-dialog/innovation-asset-preview-dialog.component';
import { BizdevAssetPreviewDialogComponent } from './document-dialog-template/bizdev-asset-preview-dialog/bizdev-asset-preview-dialog.component';
import { IntelligenceAssetPreviewDialogComponent } from './document-dialog-template/intelligence-asset-preview-dialog/intelligence-asset-preview-dialog.component';
import { CreativeAssetPreviewDialogComponent } from './document-dialog-template/creative-asset-preview-dialog/creative-asset-preview-dialog.component';
import { DocumentShowcaseTemplateComponent } from './document-dialog-template/document-showcase-template/document-showcase-template.component';
import { DocumentDeleteMultipleTemplateComponent } from './document-dialog-template/document-delete-multiple-template/document-delete-multiple-template.component';
import { BackslashAssetPreviewDialogComponent } from './document-dialog-template/backslash-asset-preview-dialog/backslash-asset-preview-dialog.component';
import { DisruptionXPreviewDialogComponent } from './document-dialog-template/disruption-x-preview-dialog/disruption-x-preview-dialog.component';
import { CreativeAssetTemplateDialogComponent } from './document-dialog-template/creative-asset-template/creative-asset-template.component';

export const GLOBAL_DOCUMENT_DIALOG = {
  PREIVEW_BACKSLASH_HOME_ASSET: BackslashHomeAssetDialogPreviewComponent,
  PREIVEW_RELATED_BACKSLASH_ASSET: RelatedBackslashAssetDialogPreviewComponent,
  PREIVEW_RELATED_DISRUPTION_ASSET: DisruptionAssetPreviewDialogComponent,
  PREIVEW_BACKSLASH_ASSET_DIALOG: BackslashAssetPreviewDialogComponent,
  PREVIEW_INTELLIGENCE_ASSET: IntelligenceAssetPreviewDialogComponent,
  PREVIEW_INNOVATION_ASSET: InnovationAssetPreviewDialogComponent,
  PREVIEW_CREATIVE_ASSET: CreativeAssetPreviewDialogComponent,
  PREVIEW_BIZDEV_ASSET: BizdevAssetPreviewDialogComponent,
  PREVIEW_DISRUPTION_X: DisruptionXPreviewDialogComponent,
  CUSTOM_DELETION: DocumentDialogDeletionTemplateComponent,
  CUSTOM_CONFIRMATION: DocumentDialogConfirmationTemplateComponent,
  CUSTOM_DELETE_MULTIPLE_ASSETS: DocumentDeleteMultipleTemplateComponent,
  CUSTOM_DOWNLOAD_REQUEST: DocumentDownloadRequestTemplateComponent,
  CUSTOM_CREATIVE_PROJECT_ASSET: CreativeProjectAssetTemplateComponent,
  CUSTOM_SHOWCASE_ADD_REMOVE: DocumentShowcaseTemplateComponent,
  CUSTOM_CREATIVE_ASSET: CreativeAssetTemplateDialogComponent,
};
