import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { LearningProgramCategoryComponent } from './learning-program-category.component';
import { LearningProgramCategoryListModule } from './learning-program-category-list/learning-program-category-list.module';
import { LearningProgramCategoryViewModule } from './learning-program-category-view/learning-program-category-view.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    LearningProgramCategoryListModule,
    LearningProgramCategoryViewModule,
  ],
  declarations: [
    LearningProgramCategoryComponent,
  ],
  exports: [
    LearningProgramCategoryComponent,
  ],
})
export class LearningProgramCategoryModule { }
