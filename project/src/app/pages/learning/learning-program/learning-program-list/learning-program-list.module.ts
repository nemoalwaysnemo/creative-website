import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { LearningProgramListComponent } from './learning-program-list.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    LearningProgramListComponent,
  ],
  exports: [
    LearningProgramListComponent,
  ],
})
export class LearningProgramListModule { }
