import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DocumentFormModule } from '../../document-form/document-form.module';
import { DocumentViewerModule } from '../../document-viewer/document-viewer.module';
import { DocumentCreativeProjectMgtModule } from '../../document-creative-project-mgt';
import { ShareDocumentButtonModule } from '../../share-document-button/share-document-button.module';
import { DocumentBackslashInfoModule } from '../../document-backslash-info/document-backslash-info.module';
import { DisruptionAssetPreviewDialogComponent } from './disruption-asset-preview/disruption-asset-preview.component';
import { DocumentDialogDeletionTemplateComponent } from './document-deletion-template/document-deletion-template.component';
import { BackslashHomeAssetDialogPreviewComponent } from './backslash-home-asset-preview/backslash-home-asset-preview.component';
import { RelatedBackslashAssetDialogPreviewComponent } from './related-backslash-asset-preview/related-backslash-asset-preview.component';
import { DocumentDialogConfirmationTemplateComponent } from './document-confirmation-template/document-confirmation-template.component';
import { DocumentDownloadRequestTemplateComponent } from './document-download-request-template/document-download-request-template.component';
import { CreativeProjectAssetTemplateComponent } from './creative-project-asset-template/creative-project-asset-template.component';
import { CreativeProjectAssetBaseTemplateComponent } from './creative-project-asset-template/creative-project-asset-base-template.component';
import { CreativeProjectAssetCompletionReportTemplateComponent } from './creative-project-asset-template/creative-project-asset-completion-report-template/creative-project-asset-completion-report-template.component';
import { CreativeProjectReportProductionInformationComponent } from './creative-project-asset-template/creative-project-asset-completion-report-template/creative-project-asset-report-production-information/creative-project-asset-report-production-information.component';
import { CreativeProjectReportAllowableVersionsComponent } from './creative-project-asset-template/creative-project-asset-completion-report-template/creative-project-asset-report-allowable-versions/creative-project-asset-report-allowable-versions.component';
import { CreativeProjectAssetReportUnionTalentComponent } from './creative-project-asset-template/creative-project-asset-completion-report-template/creative-project-asset-report-union-talent/creative-project-asset-report-union-talent.component';
import { CreativeProjectAssetDeliverableTemplateComponent } from './creative-project-asset-template/creative-project-asset-deliverable-template/creative-project-asset-deliverable-template.component';
import { CreativeProjectAssetImportLocalTemplateComponent } from './creative-project-asset-template/creative-project-asset-import-local-template/creative-project-asset-import-local-template.component';
import { CreativeProjectAssetImportRequestTemplateComponent } from './creative-project-asset-template/creative-project-asset-import-request-template/creative-project-asset-import-request-template.component';
import { CreativeProjectAssetUsageRightsTemplateComponent } from './creative-project-asset-template/creative-project-asset-usage-rights-template /creative-project-asset-usage-rights-template.component';
import { InnovationAssetPreviewDialogComponent } from './innovation-asset-preview-dialog/innovation-asset-preview-dialog.component';
import { BizdevAssetPreviewDialogComponent } from './bizdev-asset-preview-dialog/bizdev-asset-preview-dialog.component';
import { IntelligenceAssetPreviewDialogComponent } from './intelligence-asset-preview-dialog/intelligence-asset-preview-dialog.component';

const COMPONENTS = [
  BackslashHomeAssetDialogPreviewComponent,
  RelatedBackslashAssetDialogPreviewComponent,
  DisruptionAssetPreviewDialogComponent,
  DocumentDialogConfirmationTemplateComponent,
  DocumentDialogDeletionTemplateComponent,
  DocumentDownloadRequestTemplateComponent,
  CreativeProjectAssetTemplateComponent,
  CreativeProjectAssetBaseTemplateComponent,
  CreativeProjectAssetCompletionReportTemplateComponent,
  CreativeProjectReportProductionInformationComponent,
  CreativeProjectReportAllowableVersionsComponent,
  CreativeProjectAssetReportUnionTalentComponent,
  CreativeProjectAssetDeliverableTemplateComponent,
  CreativeProjectAssetImportLocalTemplateComponent,
  CreativeProjectAssetImportRequestTemplateComponent,
  CreativeProjectAssetUsageRightsTemplateComponent,
  InnovationAssetPreviewDialogComponent,
  BizdevAssetPreviewDialogComponent,
  IntelligenceAssetPreviewDialogComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    ReactiveFormsModule,
    DocumentViewerModule,
    ShareDocumentButtonModule,
    DocumentBackslashInfoModule,
    DocumentCreativeProjectMgtModule,
    DocumentFormModule,
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
