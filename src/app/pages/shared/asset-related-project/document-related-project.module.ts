import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentRelatedProjectComponent } from './document-related-project.component';
import { CreativeThumbnailViewModule } from '../creative-thumbnail-view/thumbnail-view.module';

@NgModule({
  imports: [
    CommonModule,
    CreativeThumbnailViewModule,
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
