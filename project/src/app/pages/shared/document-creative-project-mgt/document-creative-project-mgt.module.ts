import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentCreativeProjectMgtComponent } from './document-creative-project-mgt.component';
import { DocumentCreativeProjectAssetModule } from './document-creative-project-asset-page/document-creative-project-asset.module';
import { DocumentCreativeProjectImportAssetModule } from './document-creative-project-import-asset-page/document-creative-project-import-asset.module';
@NgModule({
  imports: [
    CommonModule,
    DocumentCreativeProjectAssetModule,
    DocumentCreativeProjectImportAssetModule,
  ],
  declarations: [
    DocumentCreativeProjectMgtComponent,
  ],
  exports: [
    DocumentCreativeProjectMgtComponent,
  ],
})
export class DocumentCreativeProjectMgtModule {
}
