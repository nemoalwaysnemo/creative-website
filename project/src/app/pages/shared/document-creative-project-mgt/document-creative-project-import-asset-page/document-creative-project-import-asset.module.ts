import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DocumentCreativeProjectNavigationModule } from '../shared';
import { ListSearchFormInDialogModule } from '../../list-search-form-in-dialog';
import { DocumentFormModule } from '../../document-form/document-form.module';
import { DocumentViewerModule } from '../../document-viewer/document-viewer.module';
import { DocumentShareButtonModule } from '../../document-share-button/document-share-button.module';
import { DocumentCreativeProjectImportAssetComponent } from './document-creative-project-import-asset.component';
import { DocumentNewPosterButtonModule } from '../../document-new-poster-button/document-new-poster-button.module';
import { DocumentCreativeProjectImportAssetHomeComponent } from './document-creative-project-import-asset-home/document-creative-project-import-asset-home.component';
import { DocumentCreativeProjectImportAssetFormComponent } from './document-creative-project-import-asset-form/document-creative-project-import-asset-form.component';
import { DocumentBulkImportModule } from '../../document-bulk-import/document-bulk-import.module';
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
    DocumentBulkImportModule,
  ],
  declarations: [
    DocumentCreativeProjectImportAssetComponent,
    DocumentCreativeProjectImportAssetHomeComponent,
    DocumentCreativeProjectImportAssetFormComponent,
  ],
})
export class DocumentCreativeProjectImportAssetModule {
}
