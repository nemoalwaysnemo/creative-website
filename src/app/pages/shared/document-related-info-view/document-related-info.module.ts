import { NgModule } from '@angular/core';
import { NgPipesModule } from 'ngx-pipes';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DocumentRelatedInfoComponent } from './document-related-info.component';
import { DocumentRelatedInfoViewComponent } from './document-related-info-view/document-related-info-view.component';
import { DocumentThumbnailViewModule } from '../document-thumbnail-view/document-thumbnail-view.module';
import { GlobalDocumentDialogModule } from '../global-document-dialog/global-document-dialog.module';
import { GlobalSearchFormModule } from '../global-search-form/global-search-form.module';
import { GlobalSearchResultModule } from '../global-search-result/global-search-result.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    NgPipesModule,
    GlobalDocumentDialogModule,
    DocumentThumbnailViewModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
  ],
  declarations: [
    DocumentRelatedInfoComponent,
    DocumentRelatedInfoViewComponent,
  ],
  exports: [
    DocumentRelatedInfoComponent,
  ],
})
export class DocumentRelatedInfoComponentModule {
}
