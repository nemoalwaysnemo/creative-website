import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { LearningHomeResourceComponent } from './learning-home-resource.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    LearningHomeResourceComponent,
  ],
  exports: [
    LearningHomeResourceComponent,
  ],
})
export class LearningHomeResourceModule { }
