import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { GlobalDocumentDialogComponent } from './global-document-dialog.component';
import { DocumentDialogContainerComponent } from './document-dialog-container.component';
import { DocumentDialogBaseTemplateComponent } from './document-dialog-base-template.component';
import { DocumentDialogCustomTemplateComponent } from './document-dialog-custom-template.component';
import { DocumentDialogFormComponent } from './document-dialog-form/document-dialog-form.component';
import { DocumentDialogPreviewTemplateComponent } from './document-dialog-preview-template.component';
import { DocumentDialogCustomComponent } from './document-dialog-custom/document-dialog-custom.component';
import { GlobalDocumentDialogTemplateModule } from './document-dialog-template/global-document-dialog-template.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    GlobalDocumentDialogTemplateModule,
  ],
  declarations: [
    DocumentDialogContainerComponent,
    DocumentDialogBaseTemplateComponent,
    DocumentDialogCustomTemplateComponent,
    DocumentDialogPreviewTemplateComponent,
    DocumentDialogFormComponent,
    DocumentDialogCustomComponent,
    GlobalDocumentDialogComponent,
  ],
  exports: [
    GlobalDocumentDialogComponent,
  ],
})
export class GlobalDocumentDialogModule {

}
