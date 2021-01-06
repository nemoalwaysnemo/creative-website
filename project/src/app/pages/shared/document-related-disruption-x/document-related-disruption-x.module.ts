import { NgModule } from '@angular/core';
import { NgPipesModule } from 'ngx-pipes';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GlobalSearchFormModule } from '../global-search-form/global-search-form.module';
import { DocumentRelatedDisruptionXComponent } from './document-related-disruption-x.component';
import { GlobalDocumentDialogModule } from '../global-document-dialog/global-document-dialog.module';
import { GlobalSearchMoreResultModule } from '../global-search-more-result/global-search-more-result.module';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgPipesModule,
    GlobalSearchFormModule,
    GlobalDocumentDialogModule,
    GlobalSearchMoreResultModule,
  ],
  declarations: [
    DocumentRelatedDisruptionXComponent,
  ],
  exports: [
    DocumentRelatedDisruptionXComponent,
  ],
})
export class DocumentRelatedDisruptionXModule {
}
