import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { LearningProgramCategoryViewComponent } from './learning-program-category-view.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    LearningProgramCategoryViewComponent,
  ],
  exports: [
    LearningProgramCategoryViewComponent,
  ],
})
export class LearningProgramCategoryViewModule { }
