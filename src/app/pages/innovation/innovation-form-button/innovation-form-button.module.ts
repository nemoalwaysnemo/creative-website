import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { GlobalDocumentDialogModule } from '@pages/shared';
import { InnovationFormButtonComponent } from './innovation-form-button.component';

@NgModule({
  imports: [
    ThemeModule,
    GlobalDocumentDialogModule,
  ],
  declarations: [
    InnovationFormButtonComponent,
  ],
  exports: [
    InnovationFormButtonComponent,
  ],
})
export class InnovationFormButtonModule { }
