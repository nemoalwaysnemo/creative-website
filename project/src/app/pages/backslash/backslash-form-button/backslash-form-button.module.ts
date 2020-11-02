import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { GlobalDocumentDialogModule } from '@pages/shared';
import { BackslashFormButtonComponent } from './backslash-form-button.component';

@NgModule({
  imports: [
    ThemeModule,
    GlobalDocumentDialogModule,
  ],
  declarations: [
    BackslashFormButtonComponent,
  ],
  exports: [
    BackslashFormButtonComponent,
  ],
})

export class BackslashFormButtonModule { }
