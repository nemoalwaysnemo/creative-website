import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { LearningProgramButtonComponent } from './learning-program-button.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    LearningProgramButtonComponent,
  ],
  exports: [
    LearningProgramButtonComponent,
  ],
})
export class LearningProgramButtonModule { }
