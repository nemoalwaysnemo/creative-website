import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentCreativeCampaignMgtComponent } from './document-creative-campaign-mgt.component';
import { DocumentCreativeCampaignAssetModule } from './document-creative-campaign-asset-page/document-creative-campaign-asset.module';

@NgModule({
  imports: [
    CommonModule,
    DocumentCreativeCampaignAssetModule,
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
