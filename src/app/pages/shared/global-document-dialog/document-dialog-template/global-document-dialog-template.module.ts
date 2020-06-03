import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { NbDialogModule } from '@core/nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { DocumentViewerModule } from '../../document-viewer/document-viewer.module';
import { ShareDocumentButtonModule } from '../../share-document-button/share-document-button.module';
import { BackslashHomeAssetDialogPreviewComponent } from './backslash-home-asset-preview/backslash-home-asset-preview.component';
import { DocumentBackslashInfoModule } from '../../../shared/document-backslash-info/document-backslash-info.module';
import { RelatedBackslashAssetDialogPreviewComponent } from './related-backslash-asset-preview/related-backslash-asset-preview.component';
import { DisruptionAssetPreviewDialogComponent } from './disruption-asset-preview/disruption-asset-preview.component';
import { DocumentDialogConfirmationTemplateComponent } from './document-confirmation-template/document-confirmation-template.component';
import { DocumentDialogDeletionTemplateComponent } from './document-deletion-template/document-deletion-template.component';
import { DocumentDownloadRequestTemplateComponent } from './document-download-request-template/document-download-request-template.component';
import { CreativeProjectAssetTemplateComponent } from './creative-project-asset-template/creative-project-asset-template.component';

const COMPONENTS = [
  BackslashHomeAssetDialogPreviewComponent,
  RelatedBackslashAssetDialogPreviewComponent,
  DisruptionAssetPreviewDialogComponent,
  DocumentDialogConfirmationTemplateComponent,
  DocumentDialogDeletionTemplateComponent,
  DocumentDownloadRequestTemplateComponent,
  CreativeProjectAssetTemplateComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    ReactiveFormsModule,
    DocumentViewerModule,
    ShareDocumentButtonModule,
    DocumentBackslashInfoModule,
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
