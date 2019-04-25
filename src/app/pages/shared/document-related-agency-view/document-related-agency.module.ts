import { NgModule } from '@angular/core';
import { NgPipesModule } from 'ngx-pipes';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocumentRelatedAgencyComponent } from './document-related-agency.component';
import { DocumentThumbnailViewModule } from '../document-thumbnail-view/document-thumbnail-view.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgPipesModule,
    DocumentThumbnailViewModule,
  ],
  declarations: [
    DocumentRelatedAgencyComponent,
  ],
  exports: [
    DocumentRelatedAgencyComponent,
  ],
})
export class DocumentRelatedAgencyModule {
}
