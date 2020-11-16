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
import { CreativeProjectAssetDeliverableTemplateComponent } from './creative-project-asset-template/creative-project-asset-deliverable-template/creative-project-asset-deliverable-template.component';
import { CreativeProjectAssetImportLocalTemplateComponent } from './creative-project-asset-template/creative-project-asset-import-local-template/creative-project-asset-import-local-template.component';
import { CreativeProjectAssetImportRequestTemplateComponent } from './creative-project-asset-template/creative-project-asset-import-request-template/creative-project-asset-import-request-template.component';
import { CreativeProjectAssetUsageRightsTemplateComponent } from './creative-project-asset-template/creative-project-asset-usage-rights-template /creative-project-asset-usage-rights-template.component';
import { InnovationAssetPreviewDialogComponent } from './innovation-asset-preview-dialog/innovation-asset-preview-dialog.component';
import { BizdevAssetPreviewDialogComponent } from './bizdev-asset-preview-dialog/bizdev-asset-preview-dialog.component';
import { IntelligenceAssetPreviewDialogComponent } from './intelligence-asset-preview-dialog/intelligence-asset-preview-dialog.component';
import { CreativeAssetPreviewDialogComponent } from './creative-asset-preview-dialog/creative-asset-preview-dialog.component';
import { DocumentShowcaseTemplateComponent } from './document-showcase-template/document-showcase-template.component';
import { DocumentDeleteMultipleTemplateComponent } from './document-delete-multiple-template/document-delete-multiple-template.component';
import { KnowledgeRelatedInfoModule } from '../../knowledge-related-info-view/knowledge-related-info.module';
import { CreativeAssetTemplateDialogComponent } from './creative-asset-template/creative-asset-template.component';
import { CreativeAssetTemplateTabsComponent } from './creative-asset-template/creative-asset-template-tabs/creative-asset-template-tabs.component';
import { CreativeAssetTemplateTabInfoComponent } from './creative-asset-template/creative-asset-template-tabs/creative-asset-template-tab-info/creative-asset-template-tab-info.component';
import { CreativeAssetTemplateTabUsageRightsComponent } from './creative-asset-template/creative-asset-template-tabs/creative-asset-template-tab-usage-rights/creative-asset-template-tab-usage-rights.component';
import { CreativeAssetTemplateTabUsageRightsDetailsComponent } from './creative-asset-template/creative-asset-template-tabs/creative-asset-template-tab-usage-rights-details/creative-asset-template-tab-usage-rights-details.component';
import { ListSearchFormInDialogModule } from '../../list-search-form-in-dialog/list-search-form-in-dialog.module';
import { UsageRightWidgetModule } from '../../usage-right-widget/usage-right-widget.module';

const COMPONENTS = [
  BackslashHomeAssetDialogPreviewComponent,
  RelatedBackslashAssetDialogPreviewComponent,
  DisruptionAssetPreviewDialogComponent,
  DocumentDialogConfirmationTemplateComponent,
  DocumentDialogDeletionTemplateComponent,
  DocumentDownloadRequestTemplateComponent,
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
  BizdevAssetPreviewDialogComponent,
  IntelligenceAssetPreviewDialogComponent,
  CreativeAssetPreviewDialogComponent,
  DocumentShowcaseTemplateComponent,
  DocumentDeleteMultipleTemplateComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    ReactiveFormsModule,
    DocumentFormModule,
    DocumentViewerModule,
    ShareDocumentButtonModule,
    KnowledgeRelatedInfoModule,
    DocumentBackslashInfoModule,
    DocumentCreativeProjectMgtModule,
    ListSearchFormInDialogModule,
    UsageRightWidgetModule,
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
