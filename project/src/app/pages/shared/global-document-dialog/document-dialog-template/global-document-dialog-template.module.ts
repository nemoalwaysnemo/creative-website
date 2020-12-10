import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DocumentFormModule } from '../../document-form/document-form.module';
import { DocumentViewerModule } from '../../document-viewer/document-viewer.module';
import { DocumentCreativeProjectMgtModule } from '../../document-creative-project-mgt';
import { DocumentShareButtonModule } from '../../document-share-button/document-share-button.module';
import { DocumentBackslashInfoModule } from '../../document-backslash-info/document-backslash-info.module';
import { DisruptionAssetPreviewDialogComponent } from './disruption-asset-preview-dialog/disruption-asset-preview-dialog.component';
import { DocumentDeletionDialogComponent } from './document-deletion-dialog/document-deletion-dialog.component';
import { BackslashHomeAssetDialogPreviewDialogComponent } from './backslash-home-asset-preview-dialog/backslash-home-asset-preview-dialog.component';
import { RelatedBackslashAssetDialogPreviewComponent } from './related-backslash-asset-preview-dialog/related-backslash-asset-preview-dialog.component';
import { DocumentConfirmationDialogComponent } from './document-confirmation-dialog/document-confirmation-dialog.component';
import { DocumentDownloadRequestDialogComponent } from './document-download-request-dialog/document-download-request-dialog.component';
import { CreativeProjectAssetTemplateComponent } from './creative-project-asset-template/creative-project-asset-template.component';
import { CreativeProjectAssetBaseTemplateComponent } from './creative-project-asset-template/creative-project-asset-base-template.component';
import { CreativeProjectAssetCompletionReportTemplateComponent } from './creative-project-asset-template/creative-project-asset-completion-report-template/creative-project-asset-completion-report-template.component';
import { CreativeProjectAssetDeliverableTemplateComponent } from './creative-project-asset-template/creative-project-asset-deliverable-template/creative-project-asset-deliverable-template.component';
import { CreativeProjectAssetImportLocalTemplateComponent } from './creative-project-asset-template/creative-project-asset-import-local-template/creative-project-asset-import-local-template.component';
import { CreativeProjectAssetImportRequestTemplateComponent } from './creative-project-asset-template/creative-project-asset-import-request-template/creative-project-asset-import-request-template.component';
import { CreativeProjectAssetUsageRightsTemplateComponent } from './creative-project-asset-template/creative-project-asset-usage-rights-template /creative-project-asset-usage-rights-template.component';
import { InnovationAssetPreviewDialogComponent } from './innovation-asset-preview-dialog/innovation-asset-preview-dialog.component';
import { BizdevAssetPreviewDialogComponent } from './bizdev-asset-preview-dialog/bizdev-asset-preview-dialog.component';
import { IntelligenceAssetPreviewDialogComponent } from './intelligence-asset-preview-dialog/intelligence-asset-preview-dialog.component';
import { CreativeAssetPreviewDialogComponent } from './creative-asset-preview-dialog/creative-asset-preview-dialog.component';
import { DocumentShowcaseDialogComponent } from './document-showcase-dialog/document-showcase-dialog.component';
import { DocumentMultipleDeletionComponent } from './document-multiple-deletion-dialog/document-multiple-deletion-dialog.component';
import { KnowledgeRelatedInfoModule } from '../../knowledge-related-info-view/knowledge-related-info.module';
import { CreativeAssetTemplateDialogComponent } from './creative-asset-template/creative-asset-template.component';
import { CreativeAssetTemplateTabsComponent } from './creative-asset-template/creative-asset-template-tabs/creative-asset-template-tabs.component';
import { CreativeAssetTemplateTabInfoComponent } from './creative-asset-template/creative-asset-template-tabs/creative-asset-template-tab-info/creative-asset-template-tab-info.component';
import { CreativeAssetTemplateTabUsageRightsComponent } from './creative-asset-template/creative-asset-template-tabs/creative-asset-template-tab-usage-rights/creative-asset-template-tab-usage-rights.component';
import { CreativeAssetTemplateTabUsageRightsDetailsComponent } from './creative-asset-template/creative-asset-template-tabs/creative-asset-template-tab-usage-rights-details/creative-asset-template-tab-usage-rights-details.component';
import { ListSearchFormInDialogModule } from '../../list-search-form-in-dialog/list-search-form-in-dialog.module';
import { DocumentUsageRightsStatusModule } from '../../document-usage-rights-status/document-usage-rights-status.module';
import { BackslashKnowledgeAssetPreviewDialogComponent } from './backslash-knowledge-asset-preview-dialog/backslash-knowledge-asset-preview-dialog.component';
import { DisruptionXPreviewDialogComponent } from './disruption-x-preview-dialog/disruption-x-preview-dialog.component';
import { DocumentNewPosterButtonModule } from '../../document-new-poster-button/document-new-poster-button.module';

const COMPONENTS = [
  BizdevAssetPreviewDialogComponent,
  BackslashKnowledgeAssetPreviewDialogComponent,
  BackslashHomeAssetDialogPreviewDialogComponent,
  RelatedBackslashAssetDialogPreviewComponent,
  DisruptionAssetPreviewDialogComponent,
  DisruptionXPreviewDialogComponent,
  DocumentConfirmationDialogComponent,
  DocumentDeletionDialogComponent,
  DocumentDownloadRequestDialogComponent,
  CreativeAssetPreviewDialogComponent,
  CreativeAssetTemplateDialogComponent,
  CreativeAssetTemplateTabsComponent,
  CreativeAssetTemplateTabInfoComponent,
  CreativeAssetTemplateTabUsageRightsComponent,
  CreativeAssetTemplateTabUsageRightsDetailsComponent,
  CreativeProjectAssetTemplateComponent,
  CreativeProjectAssetBaseTemplateComponent,
  CreativeProjectAssetCompletionReportTemplateComponent,
  CreativeProjectAssetDeliverableTemplateComponent,
  CreativeProjectAssetImportLocalTemplateComponent,
  CreativeProjectAssetImportRequestTemplateComponent,
  CreativeProjectAssetUsageRightsTemplateComponent,
  InnovationAssetPreviewDialogComponent,
  IntelligenceAssetPreviewDialogComponent,
  DocumentShowcaseDialogComponent,
  DocumentMultipleDeletionComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    ReactiveFormsModule,
    DocumentFormModule,
    DocumentViewerModule,
    DocumentShareButtonModule,
    DocumentBackslashInfoModule,
    DocumentNewPosterButtonModule,
    DocumentUsageRightsStatusModule,
    DocumentCreativeProjectMgtModule,
    KnowledgeRelatedInfoModule,
    ListSearchFormInDialogModule,
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
