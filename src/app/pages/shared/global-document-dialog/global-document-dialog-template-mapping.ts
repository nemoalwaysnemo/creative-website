import { BackslashHomeAssetDialogPreviewComponent } from './document-dialog-template/backslash-home-asset-preview/backslash-home-asset-preview.component';
import { RelatedBackslashAssetDialogPreviewComponent } from './document-dialog-template/related-backslash-asset-preview/related-backslash-asset-preview.component';
import { DisruptionAssetPreviewDialogComponent } from './document-dialog-template/disruption-asset-preview/disruption-asset-preview.component';
import { DocumentDialogConfirmComponent } from './document-dialog-template/document-confirm-template/document-confirm-template.component';
import { DocumentDialogDeletionComponent } from './document-dialog-template/document-deletion-template/document-deletion-template.component';

export const GLOBAL_DOCUMENT_DIALOG = {
  PREIVEW_BACKSLASH_HOME_ASSET: BackslashHomeAssetDialogPreviewComponent,
  PREIVEW_RELATED_BACKSLASH_ASSET: RelatedBackslashAssetDialogPreviewComponent,
  PREIVEW_RELATED_DISRUPTION_ASSET: DisruptionAssetPreviewDialogComponent,
  GENERAL_CONFIRM: DocumentDialogConfirmComponent,
  GENERAL_DELETION: DocumentDialogDeletionComponent,
};
