import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@pages/shared/shared.module';
import { LearningProgramComponent } from './learning-program.component';
import { LearningProgramVideoModule } from './learning-program-video/learning-program-video.module';
import { LearningProgramHeaderModule } from './learning-program-header/learning-program-header.module';
import { LearningProgramCategoryModule } from './learning-program-category/learning-program-category.module';
import { LearningProgramButtonModule } from './learning-program-button/learning-program-button.module';
import { DocumentViewerModule } from '@pages/shared/document-viewer/document-viewer.module';

@NgModule({
  imports: [
    ThemeModule,
    RouterModule,
    SharedModule,
    LearningProgramVideoModule,
    LearningProgramHeaderModule,
    LearningProgramCategoryModule,
    LearningProgramButtonModule,
    DocumentViewerModule,
  ],
  declarations: [
    LearningProgramComponent,
  ],
})
export class LearningProgramModule { }
