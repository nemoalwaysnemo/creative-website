import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { LearningFormButtonModule } from '../../../learning-form-button/learning-form-button.module';
import { LearningProgramCategoryViewComponent } from './learning-program-category-view.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    LearningFormButtonModule,
  ],
  declarations: [
    LearningProgramCategoryViewComponent,
  ],
  exports: [
    LearningProgramCategoryViewComponent,
  ],
})
export class LearningProgramCategoryViewModule { }
