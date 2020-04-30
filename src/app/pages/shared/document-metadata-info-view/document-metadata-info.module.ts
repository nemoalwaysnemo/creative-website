import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DocumentMetadataInfoComponent } from './document-metadata-info.component';
import { GlobalDocumentDialogModule } from '../global-document-dialog/global-document-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    GlobalDocumentDialogModule,
  ],
  declarations: [
    DocumentMetadataInfoComponent,
  ],
  exports: [
    DocumentMetadataInfoComponent,
  ],
})
export class DocumentMetadataInfoModule {
}
