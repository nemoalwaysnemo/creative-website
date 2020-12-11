import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { LearningPageComponent } from './learning-page.component';
import { LearningHomeModule } from './learning-home/learning-home.module';
import { LearningAlumniModule } from './learning-alumni/learning-alumni.module';
import { LearningProgramModule } from './learning-program/learning-program.module';
import { LearningPageRoutingModule } from './learning-page-routing.module';

@NgModule({
  imports: [
    ThemeModule,
    LearningHomeModule,
    LearningAlumniModule,
    LearningProgramModule,
    LearningPageRoutingModule,
  ],
  declarations: [
    LearningPageComponent,
  ],
})
export class LearningPageModule {
}
