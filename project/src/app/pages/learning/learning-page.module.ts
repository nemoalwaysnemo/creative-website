import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { LearningPageComponent } from './learning-page.component';
import { LearningAboutModule } from './learning-about/learning-about.module';
import { LearningHomeModule } from './learning-home/learning-home.module';
import { LearningAlumniModule } from './learning-alumni/learning-alumni.module';
import { LearningProgramModule } from './learning-program/learning-program.module';
import { LearningPageRoutingModule } from './learning-page-routing.module';
import { LearningRemotePageModule } from './learning-remote-page/learning-remote-page.module';

@NgModule({
  imports: [
    ThemeModule,
    LearningAboutModule,
    LearningHomeModule,
    LearningAlumniModule,
    LearningProgramModule,
    LearningRemotePageModule,
    LearningPageRoutingModule,
  ],
  declarations: [
    LearningPageComponent,
  ],
})
export class LearningPageModule {
}
