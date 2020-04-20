import { NgModule } from '@angular/core';
import { NgPipesModule } from 'ngx-pipes';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { PreviewDialogModule } from '../preview-dialog/preview-dialog.module';
import { DocumentRelatedInfoComponent } from './document-related-info.component';
import { DocumentRelatedInfoViewComponent } from './document-related-info-view/document-related-info-view.component';
import { DocumentThumbnailViewModule } from '../document-thumbnail-view/document-thumbnail-view.module';

@NgModule({
  imports: [
    CommonModule,
    NgPipesModule,
    ThemeModule,
    PreviewDialogModule,
    DocumentThumbnailViewModule,
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
