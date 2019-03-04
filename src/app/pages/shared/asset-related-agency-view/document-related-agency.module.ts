import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentRelatedAgencyComponent } from './document-related-agency.component';
import { CreativeThumbnailViewModule } from '../creative-thumbnail-view/thumbnail-view.module';
import { DocumentRelatedInfoService } from '../asset-related-info-view/document-related-info.service';

@NgModule({
  imports: [
    CommonModule,
    CreativeThumbnailViewModule,
  ],
  declarations: [
    DocumentRelatedAgencyComponent,
  ],
  exports: [
    DocumentRelatedAgencyComponent,
  ],
  providers: [
    DocumentRelatedInfoService,
  ],
})
export class DocumentRelatedAgencyModule {
}
