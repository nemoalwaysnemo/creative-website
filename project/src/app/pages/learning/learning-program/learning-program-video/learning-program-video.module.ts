import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { LearningProgramVideoComponent } from './learning-program-video.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    LearningProgramVideoComponent,
  ],
  exports: [
    LearningProgramVideoComponent,
  ],
})
export class LearningProgramVideoModule { }
