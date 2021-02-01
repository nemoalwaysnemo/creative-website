import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { LearningProgramCategoryListComponent } from './learning-program-category-list.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    LearningProgramCategoryListComponent,
  ],
  exports: [
    LearningProgramCategoryListComponent,
  ],
})
export class LearningProgramCategoryListModule { }
