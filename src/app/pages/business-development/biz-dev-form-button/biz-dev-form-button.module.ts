import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { GlobalDocumentDialogModule } from '@pages/shared';
import { BizDevFormButtonComponent } from './biz-dev-form-button.component';

@NgModule({
  imports: [
    ThemeModule,
    GlobalDocumentDialogModule,
  ],
  declarations: [
    BizDevFormButtonComponent,
  ],
  exports: [
    BizDevFormButtonComponent,
  ],
})
export class BizDevFormButtonModule { }
