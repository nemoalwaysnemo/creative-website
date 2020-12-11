import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@pages/shared/shared.module';
import { LearningProgramComponent } from './learning-program.component';

@NgModule({
  imports: [
    ThemeModule,
    RouterModule,
    SharedModule,
  ],
  declarations: [
    LearningProgramComponent,
  ],
})
export class LearningProgramModule { }
