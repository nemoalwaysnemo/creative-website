import { NgModule } from '@angular/core';
import { NgPipesModule } from 'ngx-pipes';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DocumentBackslashInfoComponent } from './document-backslash-info.component';
import { ShareDocumentButtonModule } from '../share-document-button/share-document-button.module';

@NgModule({
  imports: [
    ThemeModule,
    NgPipesModule,
    CommonModule,
    ShareDocumentButtonModule,
  ],
  declarations: [
    DocumentBackslashInfoComponent,
  ],
  exports: [
    DocumentBackslashInfoComponent,
  ],
})
export class DocumentBackslashInfoModule {
}
