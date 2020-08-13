import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { ListSearchFormModule } from '../list-search-form';
import { DocumentFormModule } from '../document-form/document-form.module';
import { DocumentListViewModule } from '../document-list-view/document-list-view.module';
import { DirectorySuggestionModule } from '../directory-suggestion/directory-suggestion.module';
import { DocumentCreativeProjectInfoComponent } from './document-creative-project-info/document-creative-project-info.component';
import { DocumentCreativeProjectUsageRightsComponent } from './document-creative-project-usage-rights/document-creative-project-usage-rights.component';
import { DocumentCreativeProjectRelatedAssetComponent } from './document-creative-project-related-asset/document-creative-project-related-asset.component';
import { DocumentCreativeProjectAssetPackageComponent } from './document-creative-project-asset-package/document-creative-project-asset-package.component';
import { DocumentCreativeProjectDeliveryPackageComponent } from './document-creative-project-delivery-package/document-creative-project-delivery-package.component';
import { DocumentCreativeProjectImportAssetComponent } from './document-creative-project-import-asset/document-creative-project-import-asset.component';
import { DocumentCreativeProjectImportAssetImageComponent } from './document-creative-project-import-asset/document-creative-project-import-asset-image/document-creative-project-import-asset-image.component';
import { DocumentCreativeProjectImportAssetVideoComponent } from './document-creative-project-import-asset/document-creative-project-import-asset-video/document-creative-project-import-asset-video.component';
import { DocumentCreativeProjectImportAssetAudioComponent } from './document-creative-project-import-asset/document-creative-project-import-asset-audio/document-creative-project-import-asset-audio.component';
import { DocumentCreativeProjectReportBuyontTalentInformationComponent } from './document-creative-project-completion-report/document-creative-project-report-buyout-talent-information/document-creative-project-report-buyout-talent-information.component';
import { DocumentCreativeProjectReportAllowableVersionsComponent } from './document-creative-project-completion-report/document-creative-project-asset-report-allowable-versions/document-creative-project-asset-report-allowable-versions.component';
import { DocumentCreativeProjectAssetReportUnionTalentComponent } from './document-creative-project-completion-report/document-creative-project-asset-report-union-talent/document-creative-project-asset-report-union-talent.component';
import { DocumentCreativeProjectReportProductionInformationComponent } from './document-creative-project-completion-report/document-creative-project-asset-report-production-information/document-creative-project-asset-report-production-information.component';
@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    ListSearchFormModule,
    DirectorySuggestionModule,
    DocumentFormModule,
    DocumentListViewModule,
  ],
  declarations: [
    DocumentCreativeProjectInfoComponent,
    DocumentCreativeProjectUsageRightsComponent,
    DocumentCreativeProjectRelatedAssetComponent,
    DocumentCreativeProjectAssetPackageComponent,
    DocumentCreativeProjectDeliveryPackageComponent,
    DocumentCreativeProjectReportBuyontTalentInformationComponent,
    DocumentCreativeProjectReportAllowableVersionsComponent,
    DocumentCreativeProjectAssetReportUnionTalentComponent,
    DocumentCreativeProjectReportProductionInformationComponent,
    DocumentCreativeProjectImportAssetComponent,
    DocumentCreativeProjectImportAssetImageComponent,
    DocumentCreativeProjectImportAssetVideoComponent,
    DocumentCreativeProjectImportAssetAudioComponent,
  ],
  exports: [
    DocumentCreativeProjectInfoComponent,
    DocumentCreativeProjectUsageRightsComponent,
    DocumentCreativeProjectRelatedAssetComponent,
    DocumentCreativeProjectAssetPackageComponent,
    DocumentCreativeProjectDeliveryPackageComponent,
    DocumentCreativeProjectReportBuyontTalentInformationComponent,
    DocumentCreativeProjectAssetReportUnionTalentComponent,
    DocumentCreativeProjectReportAllowableVersionsComponent,
    DocumentCreativeProjectReportProductionInformationComponent,
    DocumentCreativeProjectImportAssetComponent,
  ],
})
export class DocumentCreativeProjectMgtModule {
}
