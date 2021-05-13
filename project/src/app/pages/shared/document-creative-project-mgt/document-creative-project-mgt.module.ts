import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentCreativeProjectMgtComponent } from './document-creative-project-mgt.component';
import { DocumentCreativeProjectAssetModule } from './document-creative-project-asset-page/document-creative-project-asset.module';
import { DocumentCreativeProjectImportAssetModule } from './document-creative-project-import-asset-page/document-creative-project-import-asset.module';
import { DocumentCreativeProject3rdPartyImportAssetModule } from './document-creative-project-3rd-party-import-page/document-creative-project-3rd-party-import-page.module';
@NgModule({
  imports: [
    CommonModule,
    DocumentCreativeProjectAssetModule,
    DocumentCreativeProjectImportAssetModule,
    DocumentCreativeProject3rdPartyImportAssetModule,
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
