import { BackslashHomeAssetDialogPreviewComponent } from './document-dialog-template/backslash-home-asset-preview/backslash-home-asset-preview.component';
import { RelatedBackslashAssetDialogPreviewComponent } from './document-dialog-template/related-backslash-asset-preview/related-backslash-asset-preview.component';
import { DisruptionAssetPreviewDialogComponent } from './document-dialog-template/disruption-asset-preview/disruption-asset-preview.component';
import { DocumentDialogConfirmationComponent } from './document-dialog-template/document-confirmation-template/document-confirmation-template.component';
import { DocumentDownloadRequestComponent } from './document-dialog-template/document-download-request-template/document-download-request-template.component';
import { DocumentDialogDeletionComponent } from './document-dialog-template/document-deletion-template/document-deletion-template.component';

export const GLOBAL_DOCUMENT_DIALOG = {
  PREIVEW_BACKSLASH_HOME_ASSET: BackslashHomeAssetDialogPreviewComponent,
  PREIVEW_RELATED_BACKSLASH_ASSET: RelatedBackslashAssetDialogPreviewComponent,
  PREIVEW_RELATED_DISRUPTION_ASSET: DisruptionAssetPreviewDialogComponent,
  CUSTOM_CONFIRMATION: DocumentDialogConfirmationComponent,
  CUSTOM_DOWNLOAD_REQUEST: DocumentDownloadRequestComponent,
  CUSTOM_DELETION: DocumentDialogDeletionComponent,
};
