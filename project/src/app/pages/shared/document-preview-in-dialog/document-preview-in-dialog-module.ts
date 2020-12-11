import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DocumentViewerModule } from '../document-viewer/document-viewer.module';
import { DocumentShareButtonModule } from '../document-share-button/document-share-button.module';
import { DisruptionAssetPreviewInDialogComponent } from './disruption-asset-preview-in-dialog/disruption-asset-preview-in-dialog.component';
import { RelatedBackslashAssetInDialogPreviewComponent } from './related-backslash-asset-preview-in-dialog/related-backslash-asset-preview-in-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    DocumentViewerModule,
    DocumentShareButtonModule,
  ],
  declarations: [
    DisruptionAssetPreviewInDialogComponent,
    RelatedBackslashAssetInDialogPreviewComponent,
  ],
  exports: [
    DisruptionAssetPreviewInDialogComponent,
    RelatedBackslashAssetInDialogPreviewComponent,
  ],
})
export class DocumentPreviewInDialogModule {
}
