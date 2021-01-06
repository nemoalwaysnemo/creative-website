import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocumentRelatedBrandComponent } from './document-related-brand.component';
import { GlobalSearchFormModule } from '../global-search-form/global-search-form.module';
import { GlobalDocumentDialogModule } from '../global-document-dialog/global-document-dialog.module';
import { GlobalSearchMoreResultModule } from '../global-search-more-result/global-search-more-result.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    GlobalSearchFormModule,
    GlobalDocumentDialogModule,
    GlobalSearchMoreResultModule,
  ],
  declarations: [
    DocumentRelatedBrandComponent,
  ],
  exports: [
    DocumentRelatedBrandComponent,
  ],
})
export class DocumentRelatedBrandModule {
}
