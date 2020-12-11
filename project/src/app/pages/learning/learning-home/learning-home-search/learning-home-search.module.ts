import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { LearningHomeSearchComponent } from './learning-home-search.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    LearningHomeSearchComponent,
  ],
  exports: [
    LearningHomeSearchComponent,
  ],
})
export class LearningHomeSearchModule { }
