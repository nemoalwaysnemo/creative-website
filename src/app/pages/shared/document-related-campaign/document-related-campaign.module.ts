import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DragScrollModule } from 'ngx-drag-scroll';
import { DocumentRelatedCampaignComponent } from './document-related-campaign.component';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    DragScrollModule,
  ],
  declarations: [
    DocumentRelatedCampaignComponent,
  ],
  exports: [
    DocumentRelatedCampaignComponent,
  ],
})
export class DocumentRelatedCampaignModule {
}
