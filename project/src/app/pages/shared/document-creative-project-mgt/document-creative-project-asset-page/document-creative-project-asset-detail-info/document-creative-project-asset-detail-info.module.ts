import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DocumentCreativeProjectAssetDetailInfoComponent } from './document-creative-project-asset-detail-info.component';
import { DocumentCreativeProjectTabAssetRequestComponent } from './document-creative-project-tab-asset-request/document-creative-project-tab-asset-request.component';
import { DocumentCreativeProjectTabAssetUsageRightsComponent } from './document-creative-project-tab-asset-usage-rights/document-creative-project-tab-asset-usage-rights.component';
import { DocumentCreativeProjectAssetUsageRightsListComponent, DocumentCreativeAssetUsageRightsRowRenderComponent } from './document-creative-project-asset-usage-rights-list/document-creative-project-asset-usage-rights-list.component';
import { DocumentCreativeProjectTabAssetInfoComponent } from './document-creative-project-tab-asset-info/document-creative-project-tab-asset-info.component';
import { DocumentUsageRightsStatusModule } from '../../../../shared/document-usage-rights-status/document-usage-rights-status.module';
import { ListSearchFormInDialogModule } from '../../../../shared/list-search-form-in-dialog/list-search-form-in-dialog.module';
import { DocumentListViewModule } from '../../../../shared/document-list-view/document-list-view.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    DocumentUsageRightsStatusModule,
    ListSearchFormInDialogModule,
    DocumentListViewModule,
  ],
  declarations: [
    DocumentCreativeProjectTabAssetRequestComponent,
    DocumentCreativeProjectTabAssetUsageRightsComponent,
    DocumentCreativeProjectTabAssetInfoComponent,
    DocumentCreativeProjectAssetUsageRightsListComponent,
    DocumentCreativeAssetUsageRightsRowRenderComponent,
    DocumentCreativeProjectAssetDetailInfoComponent,
  ],
  exports: [
    DocumentCreativeProjectAssetDetailInfoComponent,
  ],
})
export class DocumentCreativeProjectAssetDetailInfoModule {
}
