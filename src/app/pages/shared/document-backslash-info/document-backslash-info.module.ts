import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DocumentBackslashInfoComponent } from './document-backslash-info.component';
import { ShareDocumentButtonModule } from '../share-document-button/share-document-button.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    ShareDocumentButtonModule,
  ],
  declarations: [
    DocumentBackslashInfoComponent,
  ],
  exports: [
    DocumentBackslashInfoComponent,
  ],
  entryComponents: [
    DocumentBackslashInfoComponent,
  ],
})
export class DocumentBackslashInfoModule {
}
