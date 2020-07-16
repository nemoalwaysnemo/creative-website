import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { ListSearchFormModule } from '../list-search-form';
import { DocumentCreativeProjectInfoComponent } from './document-creative-project-info/document-creative-project-info.component';
import { DocumentCreativeProjectUsageRightsComponent } from './document-creative-project-usage-rights/document-creative-project-usage-rights.component';
import { DocumentCreativeProjectRelatedAssetComponent } from './document-creative-project-related-asset/document-creative-project-related-asset.component';
import { DocumentCreativeProjectDeliveryPackageComponent } from './document-creative-project-delivery-package/document-creative-project-delivery-package.component';
import { DocumentCreativeProjectReportBuyontTalentInformationComponent } from './document-creative-project-completion-report/document-creative-project-report-buyout-talent-information/document-creative-project-report-buyout-talent-information.component';
import { DirectorySuggestionModule } from '../directory-suggestion/directory-suggestion.module';
@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    ListSearchFormModule,
    DirectorySuggestionModule,
  ],
  declarations: [
    DocumentCreativeProjectInfoComponent,
    DocumentCreativeProjectUsageRightsComponent,
    DocumentCreativeProjectRelatedAssetComponent,
    DocumentCreativeProjectDeliveryPackageComponent,
    DocumentCreativeProjectReportBuyontTalentInformationComponent,
  ],
  exports: [
    DocumentCreativeProjectInfoComponent,
    DocumentCreativeProjectUsageRightsComponent,
    DocumentCreativeProjectRelatedAssetComponent,
    DocumentCreativeProjectDeliveryPackageComponent,
    DocumentCreativeProjectReportBuyontTalentInformationComponent,
  ],
})
export class DocumentCreativeProjectMgtModule {
}
