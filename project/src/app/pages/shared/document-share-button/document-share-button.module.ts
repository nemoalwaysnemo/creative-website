import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DocumentShareButtonComponent } from './document-share-button.component';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    ClipboardModule,
  ],
  exports: [
    DocumentShareButtonComponent,
  ],
  declarations: [
    DocumentShareButtonComponent,
  ],
})
export class DocumentShareButtonModule { }
