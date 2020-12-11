import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@pages/shared/shared.module';
import { LearningProgramComponent } from './learning-program.component';
import { LearningProgramListModule } from './learning-program-list/learning-program-list.module';
import { LearningProgramMapModule } from './learning-program-map/learning-program-map.module';
import { LearningProgramVideoModule } from './learning-program-video/learning-program-video.module';
import { LearningProgramHeaderModule } from './learning-program-header/learning-program-header.module';

@NgModule({
  imports: [
    ThemeModule,
    RouterModule,
    SharedModule,
    LearningProgramListModule,
    LearningProgramMapModule,
    LearningProgramVideoModule,
    LearningProgramHeaderModule,
  ],
  declarations: [
    LearningProgramComponent,
  ],
})
export class LearningProgramModule { }
