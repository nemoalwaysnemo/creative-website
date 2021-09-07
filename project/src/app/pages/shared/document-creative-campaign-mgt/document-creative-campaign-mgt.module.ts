import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentCreativeCampaignMgtComponent } from './document-creative-campaign-mgt.component';
import { DocumentCreativeCampaignAssetModule } from './document-creative-campaign-asset-page/document-creative-campaign-asset.module';
import { DocumentCreativeCampaignProjectsListPageModule } from './document-creative-campaign-projects-list-page/document-creative-campaign-projects-list-page.module';
@NgModule({
  imports: [
    CommonModule,
    DocumentCreativeCampaignAssetModule,
    DocumentCreativeCampaignProjectsListPageModule,
  ],
  declarations: [
    DocumentCreativeCampaignMgtComponent,
  ],
  exports: [
    DocumentCreativeCampaignMgtComponent,
  ],
})
export class DocumentCreativeCampaignMgtModule {
}
