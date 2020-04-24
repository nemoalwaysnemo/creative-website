import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { NbDialogModule } from '@core/nebular/theme';
import { GlobalDocumentDialogComponent } from './global-document-dialog.component';
import { DocumentFormDialogComponent } from './document-form-dialog/document-form-dialog.component';
import { DocumentPreviewDialogComponent } from './document-preview-dialog/document-preview-dialog.component';
import { DocumentGeneralDialogComponent } from './document-general-dialog/document-general-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    NbDialogModule.forChild(),
  ],
  declarations: [
    DocumentFormDialogComponent,
    DocumentPreviewDialogComponent,
    DocumentGeneralDialogComponent,
    GlobalDocumentDialogComponent,
  ],
  entryComponents: [
    DocumentFormDialogComponent,
    DocumentPreviewDialogComponent,
    DocumentGeneralDialogComponent,
  ],
  exports: [
    GlobalDocumentDialogComponent,
  ],
})
export class GlobalDocumentDialogModule {

}
