import { NgModule } from '@angular/core';
import { NgPipesModule } from 'ngx-pipes';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DocumentRelatedInfoViewComponent } from './document-related-info-view.component';
import { DocumentThumbnailViewModule } from '../../document-thumbnail-view/document-thumbnail-view.module';
import { GlobalDocumentDialogModule } from '../../global-document-dialog/global-document-dialog.module';
import { GlobalSearchFormModule } from '../../global-search-form/global-search-form.module';
import { GlobalSearchResultModule } from '../../global-search-result/global-search-result.module';
import { GlobalSearchMoreResultModule } from '../../global-search-more-result/global-search-more-result.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    NgPipesModule,
    GlobalDocumentDialogModule,
    DocumentThumbnailViewModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    GlobalSearchMoreResultModule,
  ],
  declarations: [
    DocumentRelatedInfoViewComponent,
  ],
  exports: [
    DocumentRelatedInfoViewComponent,
  ],
})
export class DocumentRelatedInfoViewModule {
}
