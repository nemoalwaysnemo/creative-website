import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DocumentCreativeProjectNavigationModule, DocumentCreativeProjectInfoComponentModule } from '../shared';
import { ListSearchFormInDialogModule } from '../../list-search-form-in-dialog';
import { DocumentFormModule } from '../../document-form/document-form.module';
import { DocumentViewerModule } from '../../document-viewer/document-viewer.module';
import { DocumentShareButtonModule } from '../../document-share-button/document-share-button.module';
import { DocumentCreativeProjectAssetPageComponent } from './document-creative-project-asset-page.component';
import { DocumentNewPosterButtonModule } from '../../document-new-poster-button/document-new-poster-button.module';
import { DocumentCreativeProjectAssetHomeComponent, DocumentCreativeProjectAssetRowRenderComponent } from './document-creative-project-asset-home/document-creative-project-asset-home.component';
import { DocumentCreativeProjectAssetDetailModule } from './document-creative-project-asset-detail/document-creative-project-asset-detail.module';
import { DocumentCreativeProjectModifyAssetsComponent } from './document-creative-project-modify-assets/document-creative-project-modify-assets.component';
import { DocumentBatchOperationModule } from '../../document-batch-operation/document-batch-operation.module';
import { DocumentCreativeProjectAssetHomeMenuComponent } from './document-creative-project-asset-home/document-creative-project-asset-home-action/document-creative-project-asset-home-menu.component';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    DocumentFormModule,
    DocumentViewerModule,
    DocumentShareButtonModule,
    ListSearchFormInDialogModule,
    DocumentNewPosterButtonModule,
    DocumentCreativeProjectNavigationModule,
    DocumentCreativeProjectInfoComponentModule,
    DocumentCreativeProjectAssetDetailModule,
    DocumentBatchOperationModule,
  ],
  declarations: [
    DocumentCreativeProjectAssetHomeMenuComponent,
    DocumentCreativeProjectAssetPageComponent,
    DocumentCreativeProjectAssetHomeComponent,
    DocumentCreativeProjectAssetRowRenderComponent,
    DocumentCreativeProjectModifyAssetsComponent,
  ],
})
export class DocumentCreativeProjectAssetModule {
}
