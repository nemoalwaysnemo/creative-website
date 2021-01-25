import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@pages/shared/shared.module';
import { LearningAlumniComponent } from './learning-alumni.component';
import { GlobalDocumentDialogModule } from '@pages/shared';

@NgModule({
  imports: [
    ThemeModule,
    RouterModule,
    SharedModule,
    GlobalDocumentDialogModule,
  ],
  declarations: [
    LearningAlumniComponent,
  ],
})
export class LearningAlumniModule { }
