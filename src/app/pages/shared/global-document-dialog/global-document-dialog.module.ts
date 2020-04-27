import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { NbDialogModule } from '@core/nebular/theme';
import { GlobalDocumentDialogComponent } from './global-document-dialog.component';
import { DocumentDialogFormComponent } from './document-dialog-form/document-dialog-form.component';
import { DocumentDialogPreviewComponent } from './document-dialog-preview/document-dialog-preview.component';
import { DocumentDialogGeneralComponent } from './document-dialog-general/document-dialog-general.component';
import { GlobalDocumentDialogTemplateModule } from './document-dialog-template/global-document-dialog-template.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    NbDialogModule.forChild(),
    GlobalDocumentDialogTemplateModule,
  ],
  declarations: [
    DocumentDialogFormComponent,
    DocumentDialogPreviewComponent,
    DocumentDialogGeneralComponent,
    GlobalDocumentDialogComponent,
  ],
  entryComponents: [
    DocumentDialogFormComponent,
    DocumentDialogPreviewComponent,
    DocumentDialogGeneralComponent,
  ],
  exports: [
    GlobalDocumentDialogComponent,
  ],
})
export class GlobalDocumentDialogModule {

}
