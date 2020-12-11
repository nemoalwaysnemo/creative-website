import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { LearningProgramMapComponent } from './learning-program-map.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    LearningProgramMapComponent,
  ],
  exports: [
    LearningProgramMapComponent,
  ],
})
export class LearningProgramMapModule { }
