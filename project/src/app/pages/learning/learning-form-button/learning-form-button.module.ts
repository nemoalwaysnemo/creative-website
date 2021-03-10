import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { GlobalDocumentDialogModule } from '@pages/shared';
import { LearningFormButtonComponent } from './learning-form-button.component';

@NgModule({
  imports: [
    ThemeModule,
    GlobalDocumentDialogModule,
  ],
  declarations: [
    LearningFormButtonComponent,
  ],
  exports: [
    LearningFormButtonComponent,
  ],
})

export class LearningFormButtonModule { }
