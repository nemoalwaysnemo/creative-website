import { NgModule } from '@angular/core';
import { NgPipesModule } from 'ngx-pipes';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule } from '../../global-search-form/global-search-form.module';
import { KnowledgeRelatedInfoViewComponent } from './knowledge-related-info-view.component';
import { DocumentThumbnailViewModule } from '../../document-thumbnail-view/document-thumbnail-view.module';
import { GlobalSearchResultInDialogModule } from '../../global-search-result-in-dialog/global-search-result-in-dialog.module';
import { GlobalSearchMoreResultInDialogModule } from '../../global-search-more-result-in-dialog/global-search-more-result-in-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    NgPipesModule,
    DocumentThumbnailViewModule,
    GlobalSearchFormModule,
    GlobalSearchResultInDialogModule,
    GlobalSearchMoreResultInDialogModule,
  ],
  declarations: [
    KnowledgeRelatedInfoViewComponent,
  ],
  exports: [
    KnowledgeRelatedInfoViewComponent,
  ],
})
export class KnowledgeRelatedInfoViewModule {
}
