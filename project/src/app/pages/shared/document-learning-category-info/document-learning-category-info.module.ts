import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { DocumentLearningProgramInfoModule } from '../document-learning-program-info/document-learning-program-info.module';
import { DocumentLearningCategoryInfoComponent } from './document-learning-category-info.component';

@NgModule({
  imports: [
    ThemeModule,
    DocumentLearningProgramInfoModule,
  ],
  declarations: [
    DocumentLearningCategoryInfoComponent,
  ],
  exports: [
    DocumentLearningCategoryInfoComponent,
  ],
})
export class DocumentLearningCategoryInfoModule {
}
