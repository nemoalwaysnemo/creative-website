import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { LearningProgramHeaderComponent } from './learning-program-header.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    LearningProgramHeaderComponent,
  ],
  exports: [
    LearningProgramHeaderComponent,
  ],
})
export class LearningProgramHeaderModule { }
