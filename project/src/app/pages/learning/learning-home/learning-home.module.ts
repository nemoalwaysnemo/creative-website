import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@pages/shared/shared.module';
import { LearningHomeComponent } from './learning-home.component';
import { LearningHomeSearchModule } from './learning-home-search/learning-home-search.module';
import { LearningHomeResourceModule } from './learning-home-resource/learning-home-resource.module';

@NgModule({
  imports: [
    ThemeModule,
    RouterModule,
    SharedModule,
    LearningHomeSearchModule,
    LearningHomeResourceModule,
  ],
  declarations: [
    LearningHomeComponent,
  ],
})
export class LearningHomeModule { }
