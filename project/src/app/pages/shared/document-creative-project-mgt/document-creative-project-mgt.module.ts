import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentCreativeProjectMgtComponent } from './document-creative-project-mgt.component';
import { DocumentCreativeProjectAssetModule } from './document-creative-project-asset-page/document-creative-project-asset.module';
import { DocumentCreativeProjectImportAssetModule } from './document-creative-project-import-asset-page/document-creative-project-import-asset.module';
import { DocumentCreativeProject3rdPartyImportAssetModule } from './document-creative-project-3rd-party-import-page/document-creative-project-3rd-party-import-page.module';
import { DocumentCreativeProjectDeliveryPackageModule } from './document-creative-project-delivery-package-page/document-creative-project-delivery-package.module';
import { DocumentCreativeProjectUsageRightsModule } from './document-creative-project-usage-rights-page/document-creative-project-usage-rights-page.module';

@NgModule({
  imports: [
    CommonModule,
    DocumentCreativeProjectAssetModule,
    DocumentCreativeProjectImportAssetModule,
    DocumentCreativeProject3rdPartyImportAssetModule,
    DocumentCreativeProjectDeliveryPackageModule,
    DocumentCreativeProjectUsageRightsModule,
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
