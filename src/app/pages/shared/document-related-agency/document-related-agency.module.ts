import { NgModule } from '@angular/core';
import { NgPipesModule } from 'ngx-pipes';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocumentRelatedAgencyComponent } from './document-related-agency.component';
import { DocumentThumbnailViewModule } from '../document-thumbnail-view/document-thumbnail-view.module';
import { GlobalSearchFormModule } from '../global-search-form/global-search-form.module';
import { GlobalSearchResultModule } from '../global-search-result/global-search-result.module';
import { GlobalDocumentDialogModule } from '../global-document-dialog/global-document-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgPipesModule,
    DocumentThumbnailViewModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    GlobalDocumentDialogModule,
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
