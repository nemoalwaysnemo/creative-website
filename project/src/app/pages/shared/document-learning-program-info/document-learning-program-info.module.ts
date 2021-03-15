import { NgModule } from '@angular/core';
import { NgPipesModule } from 'ngx-pipes';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DocumentViewerModule } from '../document-viewer/document-viewer.module';
import { DocumentLearningProgramInfoComponent } from './document-learning-program-info.component';
import { GlobalDocumentDialogModule } from '../global-document-dialog/global-document-dialog.module';
import { DocumentNewPosterButtonModule } from '../document-new-poster-button/document-new-poster-button.module';

@NgModule({
  imports: [
    ThemeModule,
    NgPipesModule,
    CommonModule,
    DocumentViewerModule,
    GlobalDocumentDialogModule,
    DocumentNewPosterButtonModule,
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
