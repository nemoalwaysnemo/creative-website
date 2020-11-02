import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { ShareDocumentButtonComponent } from './share-document-button.component';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    ClipboardModule,
  ],
  exports: [
    ShareDocumentButtonComponent,
  ],
  declarations: [
    ShareDocumentButtonComponent,
  ],
})
export class ShareDocumentButtonModule { }
