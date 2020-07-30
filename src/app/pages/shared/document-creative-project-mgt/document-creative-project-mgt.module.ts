import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { ListSearchFormModule } from '../list-search-form';
import { DocumentCreativeProjectInfoComponent } from './document-creative-project-info/document-creative-project-info.component';
import { DocumentCreativeProjectUsageRightsComponent } from './document-creative-project-usage-rights/document-creative-project-usage-rights.component';
import { DocumentCreativeProjectRelatedAssetComponent } from './document-creative-project-related-asset/document-creative-project-related-asset.component';
import { DocumentCreativeProjectAssetPackageComponent } from './document-creative-project-asset-package/document-creative-project-asset-package.component';
import { DocumentCreativeProjectDeliveryPackageComponent } from './document-creative-project-delivery-package/document-creative-project-delivery-package.component';
import { DocumentCreativeProjectReportBuyontTalentInformationComponent } from './document-creative-project-completion-report/document-creative-project-report-buyout-talent-information/document-creative-project-report-buyout-talent-information.component';
import { DirectorySuggestionModule } from '../directory-suggestion/directory-suggestion.module';
import { DocumentFormModule } from '../document-form/document-form.module';
import { DocumentListViewModule } from '../document-list-view/document-list-view.module';

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
  ],
  exports: [
    DocumentCreativeProjectInfoComponent,
    DocumentCreativeProjectUsageRightsComponent,
    DocumentCreativeProjectRelatedAssetComponent,
    DocumentCreativeProjectAssetPackageComponent,
    DocumentCreativeProjectDeliveryPackageComponent,
    DocumentCreativeProjectReportBuyontTalentInformationComponent,
  ],
})
export class DocumentCreativeProjectMgtModule {
}
