import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DocumentRelatedInfoComponent } from './document-related-info.component';
import { CreativeThumbnailViewModule } from '../creative-thumbnail-view/thumbnail-view.module';
import { DocumentRelatedInfoViewComponent } from './document-related-info-view/document-related-info-view.component';
import { PreviewDialogModule } from '../preview-dialog/preview-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    CreativeThumbnailViewModule,
    PreviewDialogModule,
  ],
  declarations: [
    DocumentRelatedInfoComponent,
    DocumentRelatedInfoViewComponent,
  ],
  exports: [
    DocumentRelatedInfoComponent,
  ],
  providers: [
    PreviewDialogModule.forRoot().providers,
  ],
})
export class DocumentRelatedInfoComponentModule {
}
