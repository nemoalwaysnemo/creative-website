import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { NbDialogModule } from '@core/nebular/theme';
import { DocumentViewerModule } from '../../document-viewer/document-viewer.module';
import { ShareDocumentButtonModule } from '../../share-document-button/share-document-button.module';
import { BackslashHomeAssetDialogPreviewComponent } from './backslash-home-asset-preview/backslash-home-asset-preview.component';
import { DocumentBackslashInfoModule } from '../../../shared/document-backslash-info/document-backslash-info.module';
import { RelatedBackslashAssetDialogPreviewComponent } from './related-backslash-asset-preview/related-backslash-asset-preview.component';
import { DisruptionAssetPreviewDialogComponent } from './disruption-asset-preview/disruption-asset-preview.component';
import { DocumentDialogConfirmComponent } from './document-confirm-template/document-confirm-template.component';
import { DocumentDialogDeletionComponent } from './document-deletion-template/document-deletion-template.component';

const COMPONENTS = [
  BackslashHomeAssetDialogPreviewComponent,
  RelatedBackslashAssetDialogPreviewComponent,
  DisruptionAssetPreviewDialogComponent,
  DocumentDialogConfirmComponent,
  DocumentDialogDeletionComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    DocumentViewerModule,
    ShareDocumentButtonModule,
    DocumentBackslashInfoModule,
    NbDialogModule.forChild(),
  ],
  declarations: [
    ...COMPONENTS,
  ],
  entryComponents: [
    ...COMPONENTS,
  ],
  exports: [
    ...COMPONENTS,
  ],
})
export class GlobalDocumentDialogTemplateModule {

}
