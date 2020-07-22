import { BackslashHomeAssetDialogPreviewComponent } from './document-dialog-template/backslash-home-asset-preview/backslash-home-asset-preview.component';
import { RelatedBackslashAssetDialogPreviewComponent } from './document-dialog-template/related-backslash-asset-preview/related-backslash-asset-preview.component';
import { DisruptionAssetPreviewDialogComponent } from './document-dialog-template/disruption-asset-preview/disruption-asset-preview.component';
import { DocumentDialogConfirmationTemplateComponent } from './document-dialog-template/document-confirmation-template/document-confirmation-template.component';
import { DocumentDownloadRequestTemplateComponent } from './document-dialog-template/document-download-request-template/document-download-request-template.component';
import { DocumentDialogDeletionTemplateComponent } from './document-dialog-template/document-deletion-template/document-deletion-template.component';
import { CreativeProjectAssetTemplateComponent } from './document-dialog-template/creative-project-asset-template/creative-project-asset-template.component';
import { InnovationAssetPreviewDialogComponent } from './document-dialog-template/innovation-asset-preview-dialog/innovation-asset-preview-dialog.component';
import { BizdevAssetPreviewDialogComponent } from './document-dialog-template/bizdev-asset-preview-dialog/bizdev-asset-preview-dialog.component';

export const GLOBAL_DOCUMENT_DIALOG = {
  PREIVEW_BACKSLASH_HOME_ASSET: BackslashHomeAssetDialogPreviewComponent,
  PREIVEW_RELATED_BACKSLASH_ASSET: RelatedBackslashAssetDialogPreviewComponent,
  PREIVEW_RELATED_DISRUPTION_ASSET: DisruptionAssetPreviewDialogComponent,
  CUSTOM_CONFIRMATION: DocumentDialogConfirmationTemplateComponent,
  CUSTOM_DOWNLOAD_REQUEST: DocumentDownloadRequestTemplateComponent,
  CUSTOM_DELETION: DocumentDialogDeletionTemplateComponent,
  CUSTOM_CREATIVE_PROJECT_ASSET: CreativeProjectAssetTemplateComponent,
  PREVIEW_INNOVATION_ASSET: InnovationAssetPreviewDialogComponent,
  PREVIEW_BIZDEV_ASSET: BizdevAssetPreviewDialogComponent,
};
