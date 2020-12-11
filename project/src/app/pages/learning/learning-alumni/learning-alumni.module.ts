import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@pages/shared/shared.module';
import { LearningAlumniComponent } from './learning-alumni.component';

@NgModule({
  imports: [
    ThemeModule,
    RouterModule,
    SharedModule,
  ],
  declarations: [
    LearningAlumniComponent,
  ],
})
export class LearningAlumniModule { }
