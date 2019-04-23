import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocumentRelatedProjectComponent } from './document-related-project.component';
import { DocumentThumbnailViewModule } from '../document-thumbnail-view/document-thumbnail-view.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DocumentThumbnailViewModule,
  ],
  declarations: [
    DocumentRelatedProjectComponent,
  ],
  exports: [
    DocumentRelatedProjectComponent,
  ],
})
export class DocumentRelatedProjectModule {
}
