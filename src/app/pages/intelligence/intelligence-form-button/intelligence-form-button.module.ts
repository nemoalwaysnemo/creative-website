import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { GlobalDocumentDialogModule } from '@pages/shared';
import { IntelligenceFormButtonComponent } from './intelligence-form-button.component';

@NgModule({
  imports: [
    ThemeModule,
    GlobalDocumentDialogModule,
  ],
  declarations: [
    IntelligenceFormButtonComponent,
  ],
  exports: [
    IntelligenceFormButtonComponent,
  ],
})

export class DisruptionFormButtonModule { }
