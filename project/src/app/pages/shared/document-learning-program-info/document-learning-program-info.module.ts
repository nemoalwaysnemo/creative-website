import { NgModule } from '@angular/core';
import { NgPipesModule } from 'ngx-pipes';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DocumentLearningProgramInfoComponent } from './document-learning-program-info.component';
import { GlobalDocumentDialogModule } from '../global-document-dialog/global-document-dialog.module';

@NgModule({
  imports: [
    ThemeModule,
    NgPipesModule,
    CommonModule,
    GlobalDocumentDialogModule,
  ],
  declarations: [
    DocumentLearningProgramInfoComponent,
  ],
  exports: [
    DocumentLearningProgramInfoComponent,
  ],
})
export class DocumentLearningProgramInfoModule {
}
