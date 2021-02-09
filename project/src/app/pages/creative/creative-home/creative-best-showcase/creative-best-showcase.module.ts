import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { GlobalDocumentDialogModule } from '../../../shared/global-document-dialog/global-document-dialog.module';
import { CreativeBestShowcaseComponent } from './creative-best-showcase.component';
import { DocumentThumbnailViewModule } from '../../../shared/document-thumbnail-view/document-thumbnail-view.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    GlobalDocumentDialogModule,
    DocumentThumbnailViewModule,
  ],
  declarations: [
    CreativeBestShowcaseComponent,
  ],
  exports: [
    CreativeBestShowcaseComponent,
  ],
})
export class CreativeBestShowcaseModule { }
