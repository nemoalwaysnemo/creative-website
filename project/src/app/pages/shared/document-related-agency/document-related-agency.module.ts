import { NgModule } from '@angular/core';
import { NgPipesModule } from 'ngx-pipes';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocumentRelatedAgencyComponent } from './document-related-agency.component';
import { DocumentThumbnailViewModule } from '../document-thumbnail-view/document-thumbnail-view.module';
import { GlobalSearchFormModule } from '../global-search-form/global-search-form.module';
import { GlobalDocumentDialogModule } from '../global-document-dialog/global-document-dialog.module';
import { GlobalSearchMoreResultModule } from '../global-search-more-result/global-search-more-result.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgPipesModule,
    DocumentThumbnailViewModule,
    GlobalSearchFormModule,
    GlobalDocumentDialogModule,
    GlobalSearchMoreResultModule,
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
