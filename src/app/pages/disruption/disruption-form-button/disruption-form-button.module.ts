import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { GlobalDocumentDialogModule } from '@pages/shared';
import { DisruptionFormButtonComponent } from './disruption-form-button.component';

@NgModule({
  imports: [
    ThemeModule,
    GlobalDocumentDialogModule,
  ],
  declarations: [
    DisruptionFormButtonComponent,
  ],
  exports: [
    DisruptionFormButtonComponent,
  ],
})

export class DisruptionFormButtonModule { }
